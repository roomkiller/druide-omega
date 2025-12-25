/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Public API Endpoints                                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

async function validateApiKey(base44, apiKey, requiredPermission) {
  const response = await base44.functions.invoke('apiKeyValidation', {
    api_key: apiKey,
    operation: requiredPermission
  });

  return response.data;
}

async function logApiRequest(base44, apiKey, endpoint, status, duration, error = null) {
  await base44.asServiceRole.entities.IntegrationLog.create({
    integration_id: apiKey.substring(0, 16),
    event_type: `api.${endpoint}`,
    status,
    request_data: { endpoint },
    response_data: status === 'success' ? { duration_ms: duration } : null,
    error_message: error,
    duration_ms: duration
  });
}

Deno.serve(async (req) => {
  const startTime = Date.now();
  const base44 = createClientFromRequest(req);
  const url = new URL(req.url);
  const path = url.pathname;
  
  // Extraire API Key
  const apiKey = req.headers.get('X-API-Key') || url.searchParams.get('api_key');
  
  if (!apiKey) {
    return Response.json({ error: 'API key required' }, { status: 401 });
  }

  try {
    // === CONVERSATIONS API ===
    if (path === '/conversations' && req.method === 'GET') {
      const validation = await validateApiKey(base44, apiKey, 'read:conversations');
      if (!validation.valid) {
        return Response.json({ error: validation.error }, { status: validation.error.includes('Rate limit') ? 429 : 401 });
      }

      const conversations = await base44.asServiceRole.entities.Conversation.filter({
        created_by: validation.user_email
      }, '-created_date', 50);

      await logApiRequest(base44, apiKey, 'conversations.list', 'success', Date.now() - startTime);

      return Response.json({ 
        data: conversations,
        meta: { count: conversations.length }
      });
    }

    if (path.startsWith('/conversations/') && req.method === 'GET') {
      const validation = await validateApiKey(base44, apiKey, 'read:conversations');
      if (!validation.valid) {
        return Response.json({ error: validation.error }, { status: 401 });
      }

      const id = path.split('/')[2];
      const conversations = await base44.asServiceRole.entities.Conversation.filter({ id });

      if (conversations.length === 0 || conversations[0].created_by !== validation.user_email) {
        return Response.json({ error: 'Conversation not found' }, { status: 404 });
      }

      await logApiRequest(base44, apiKey, 'conversations.get', 'success', Date.now() - startTime);

      return Response.json({ data: conversations[0] });
    }

    // === MEMORIES API ===
    if (path === '/memories' && req.method === 'GET') {
      const validation = await validateApiKey(base44, apiKey, 'read:memories');
      if (!validation.valid) {
        return Response.json({ error: validation.error }, { status: 401 });
      }

      const limit = parseInt(url.searchParams.get('limit') || '50');
      const memories = await base44.asServiceRole.entities.Memory.filter({
        created_by: validation.user_email
      }, '-created_date', limit);

      await logApiRequest(base44, apiKey, 'memories.list', 'success', Date.now() - startTime);

      return Response.json({ 
        data: memories,
        meta: { count: memories.length }
      });
    }

    if (path === '/memories' && req.method === 'POST') {
      const validation = await validateApiKey(base44, apiKey, 'write:memories');
      if (!validation.valid) {
        return Response.json({ error: validation.error }, { status: 401 });
      }

      const body = await req.json();
      
      const memory = await base44.asServiceRole.entities.Memory.create({
        ...body,
        created_by: validation.user_email
      });

      await logApiRequest(base44, apiKey, 'memories.create', 'success', Date.now() - startTime);

      return Response.json({ data: memory }, { status: 201 });
    }

    // === KNOWLEDGE API ===
    if (path === '/knowledge' && req.method === 'GET') {
      const validation = await validateApiKey(base44, apiKey, 'read:knowledge');
      if (!validation.valid) {
        return Response.json({ error: validation.error }, { status: 401 });
      }

      const kbs = await base44.asServiceRole.entities.KnowledgeBase.filter({
        created_by: validation.user_email
      }, '-created_date', 50);

      await logApiRequest(base44, apiKey, 'knowledge.list', 'success', Date.now() - startTime);

      return Response.json({ 
        data: kbs,
        meta: { count: kbs.length }
      });
    }

    // === CHAT API ===
    if (path === '/chat' && req.method === 'POST') {
      const validation = await validateApiKey(base44, apiKey, 'write:conversations');
      if (!validation.valid) {
        return Response.json({ error: validation.error }, { status: 401 });
      }

      const { message, conversation_id } = await req.json();

      if (!message) {
        return Response.json({ error: 'message required' }, { status: 400 });
      }

      // Générer réponse via LLM
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: message,
        add_context_from_internet: false
      });

      const aiMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      await logApiRequest(base44, apiKey, 'chat.message', 'success', Date.now() - startTime);

      // Trigger webhook
      await base44.functions.invoke('webhookTrigger', {
        event_type: 'message.sent',
        payload: { message, response },
        user_email: validation.user_email
      });

      return Response.json({ data: aiMessage });
    }

    // === LLM DIRECT API ===
    if (path === '/llm/invoke' && req.method === 'POST') {
      const validation = await validateApiKey(base44, apiKey, 'admin');
      if (!validation.valid) {
        return Response.json({ error: validation.error }, { status: 401 });
      }

      const { prompt, add_context_from_internet, response_json_schema } = await req.json();

      if (!prompt) {
        return Response.json({ error: 'prompt required' }, { status: 400 });
      }

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: add_context_from_internet || false,
        response_json_schema
      });

      await logApiRequest(base44, apiKey, 'llm.invoke', 'success', Date.now() - startTime);

      return Response.json({ data: response });
    }

    // === IMAGE GENERATION API ===
    if (path === '/images/generate' && req.method === 'POST') {
      const validation = await validateApiKey(base44, apiKey, 'write:images');
      if (!validation.valid) {
        return Response.json({ error: validation.error }, { status: 401 });
      }

      const { prompt } = await req.json();

      if (!prompt) {
        return Response.json({ error: 'prompt required' }, { status: 400 });
      }

      const result = await base44.integrations.Core.GenerateImage({ prompt });

      await logApiRequest(base44, apiKey, 'images.generate', 'success', Date.now() - startTime);

      return Response.json({ data: { url: result.url } });
    }

    // === ANALYTICS API ===
    if (path === '/analytics/usage' && req.method === 'GET') {
      const validation = await validateApiKey(base44, apiKey, 'read:analytics');
      if (!validation.valid) {
        return Response.json({ error: validation.error }, { status: 401 });
      }

      const logs = await base44.asServiceRole.entities.IntegrationLog.filter({
        integration_id: apiKey.substring(0, 16)
      }, '-created_date', 100);

      const stats = {
        total_requests: logs.length,
        success_rate: (logs.filter(l => l.status === 'success').length / logs.length * 100).toFixed(2),
        avg_duration_ms: logs.reduce((acc, l) => acc + (l.duration_ms || 0), 0) / logs.length,
        by_endpoint: {}
      };

      logs.forEach(log => {
        const endpoint = log.event_type.replace('api.', '');
        stats.by_endpoint[endpoint] = (stats.by_endpoint[endpoint] || 0) + 1;
      });

      await logApiRequest(base44, apiKey, 'analytics.usage', 'success', Date.now() - startTime);

      return Response.json({ data: stats });
    }

    // === HEALTH CHECK ===
    if (path === '/health' && req.method === 'GET') {
      return Response.json({ 
        status: 'operational',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    }

    // Endpoint non trouvé
    return Response.json({ 
      error: 'Endpoint not found',
      available_endpoints: [
        'GET /health - Health check',
        'GET /conversations - List conversations',
        'GET /conversations/:id - Get conversation',
        'GET /memories - List memories',
        'POST /memories - Create memory',
        'GET /knowledge - List knowledge',
        'POST /chat - Send message',
        'POST /llm/invoke - Direct LLM invocation (admin)',
        'POST /images/generate - Generate image',
        'GET /analytics/usage - Usage statistics'
      ],
      documentation: 'https://druide-omega.base44.app/APIDocumentation'
    }, { status: 404 });

  } catch (error) {
    console.error('Public API error:', error);
    await logApiRequest(base44, apiKey, 'error', 'failure', Date.now() - startTime, error.message);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
});