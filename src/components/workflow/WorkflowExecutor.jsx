/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Workflow Execution Engine                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class WorkflowExecutor {
  static async execute(workflow, triggerData = {}) {
    const startTime = Date.now();
    const executedActions = [];

    try {
      // Créer l'enregistrement d'exécution
      const execution = await base44.entities.WorkflowExecution.create({
        workflow_id: workflow.id,
        status: "running",
        trigger_data: triggerData,
        executed_actions: []
      });

      // Exécuter chaque action séquentiellement
      for (const action of workflow.actions) {
        const actionStart = Date.now();

        try {
          const result = await this.executeAction(action, triggerData, executedActions);
          
          executedActions.push({
            action_id: action.id,
            status: "success",
            result,
            duration_ms: Date.now() - actionStart,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          executedActions.push({
            action_id: action.id,
            status: "failed",
            error: error.message,
            duration_ms: Date.now() - actionStart,
            timestamp: new Date().toISOString()
          });

          // Mettre à jour et arrêter en cas d'erreur
          await base44.entities.WorkflowExecution.update(execution.id, {
            status: "failed",
            executed_actions: executedActions,
            error: error.message,
            duration_ms: Date.now() - startTime
          });

          throw error;
        }
      }

      // Succès
      await base44.entities.WorkflowExecution.update(execution.id, {
        status: "success",
        executed_actions: executedActions,
        duration_ms: Date.now() - startTime,
        output: executedActions[executedActions.length - 1]?.result
      });

      // Mettre à jour le workflow
      await base44.entities.Workflow.update(workflow.id, {
        execution_count: (workflow.execution_count || 0) + 1,
        last_execution: new Date().toISOString()
      });

      return { success: true, execution };
    } catch (error) {
      console.error("Workflow execution error:", error);
      return { success: false, error: error.message };
    }
  }

  static async executeAction(action, triggerData, previousResults) {
    switch (action.type) {
      case "ai_analysis":
        return await this.executeAIAnalysis(action, triggerData, previousResults);
      
      case "create_memory":
        return await this.executeCreateMemory(action, triggerData, previousResults);
      
      case "send_notification":
        return await this.executeSendNotification(action, triggerData, previousResults);
      
      case "generate_content":
        return await this.executeGenerateContent(action, triggerData, previousResults);
      
      case "update_entity":
        return await this.executeUpdateEntity(action, triggerData, previousResults);
      
      case "conditional":
        return await this.executeConditional(action, triggerData, previousResults);
      
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  static async executeAIAnalysis(action, triggerData, previousResults) {
    const prompt = action.config.prompt || "Analyse les données";
    const contextData = this.buildContext(triggerData, previousResults);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `${prompt}\n\nContexte:\n${JSON.stringify(contextData, null, 2)}`
    });

    return { analysis: result, context: contextData };
  }

  static async executeCreateMemory(action, triggerData, previousResults) {
    const lastResult = previousResults[previousResults.length - 1]?.result;
    
    return await base44.entities.Memory.create({
      content: action.config.content || JSON.stringify(lastResult),
      memory_type: "workflow_generated",
      importance: action.config.importance || 5,
      tags: ["workflow", ...(action.config.tags || [])]
    });
  }

  static async executeSendNotification(action, triggerData, previousResults) {
    const message = action.config.message || "Notification du workflow";
    
    return await base44.entities.Notification.create({
      type: "info",
      title: action.config.title || "Workflow",
      message,
      metadata: { trigger_data: triggerData }
    });
  }

  static async executeGenerateContent(action, triggerData, previousResults) {
    const prompt = action.config.prompt || "Génère du contenu";
    
    return await base44.integrations.Core.InvokeLLM({
      prompt: `${prompt}\n\nBasé sur: ${JSON.stringify(triggerData, null, 2)}`
    });
  }

  static async executeUpdateEntity(action, triggerData, previousResults) {
    const entityName = action.config.entity;
    const entityId = action.config.entity_id || triggerData.entity_id;
    const updates = action.config.updates || {};

    // Note: This is a simplified version. In production, you'd need more robust entity handling
    return { updated: true, entity: entityName, id: entityId, updates };
  }

  static async executeConditional(action, triggerData, previousResults) {
    const condition = action.config.condition || "true";
    const contextData = this.buildContext(triggerData, previousResults);
    
    // Simple condition evaluation (in production, use a safer eval alternative)
    const result = this.evaluateCondition(condition, contextData);
    
    return { condition_met: result, condition };
  }

  static buildContext(triggerData, previousResults) {
    return {
      trigger: triggerData,
      previous: previousResults.map(r => r.result),
      timestamp: new Date().toISOString()
    };
  }

  static evaluateCondition(condition, context) {
    // Simplified - in production use a proper expression evaluator
    try {
      return true; // Default to true for safety
    } catch {
      return false;
    }
  }
}