import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { installLLMGateway } from '@/api/llmGateway';

const { appId, serverUrl, token, functionsVersion } = appParams;

//Create a client with authentication required
export const base44 = installLLMGateway(createClient({
  appId,
  serverUrl,
  token,
  functionsVersion,
  requiresAuth: false
}));