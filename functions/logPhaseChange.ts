import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phase_id, change_type, change_description, old_value, new_value } = await req.json();

    // Create history entry
    await base44.entities.PhaseHistory.create({
      phase_id,
      change_type,
      change_description,
      old_value: old_value?.toString(),
      new_value: new_value?.toString(),
      changed_by_email: user.email,
      timestamp: new Date().toISOString(),
    });

    // Create notification based on change type
    let notifType = 'phase_status_changed';
    let severity = 'info';
    let title = 'Changement dans la phase';
    let message = change_description;

    if (change_type === 'milestone') {
      notifType = 'milestone_added';
      severity = 'success';
      title = 'Jalon ajouté';
    }

    if (change_type === 'status' && new_value === 'completed') {
      severity = 'success';
      title = 'Phase complétée';
    }

    await base44.entities.Notification.create({
      type: notifType,
      title,
      message,
      phase_id,
      severity,
      read: false,
      dismissible: true,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});