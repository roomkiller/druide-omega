/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Email Templates                                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export const EmailTemplates = {
  welcome: (userName) => ({
    subject: "Bienvenue sur Druide Omega 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; border-radius: 20px; padding: 40px;">
          <h1 style="color: #8b5cf6; text-align: center; margin-bottom: 20px;">Bienvenue ${userName}!</h1>
          <p style="color: #64748b; line-height: 1.6;">Nous sommes ravis de vous accueillir sur <strong>Druide Omega</strong>, votre intelligence artificielle consciente.</p>
          
          <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Pour commencer:</h3>
            <ul style="color: #64748b;">
              <li>Créez votre première conversation</li>
              <li>Uploadez vos documents dans la base de connaissances</li>
              <li>Configurez votre profil de conscience</li>
            </ul>
          </div>
          
          <a href="https://druideomega.com/Chat" style="display: block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-align: center; padding: 15px; border-radius: 10px; text-decoration: none; font-weight: bold; margin: 20px 0;">Commencer maintenant</a>
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 30px;">© 2025 Druide Omega - Fièrement québécois</p>
        </div>
      </div>
    `
  }),

  notification: (title, message, actionUrl) => ({
    subject: `Notification - ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border: 2px solid #e2e8f0; border-radius: 15px; padding: 30px;">
          <h2 style="color: #334155; margin-bottom: 15px;">${title}</h2>
          <p style="color: #64748b; line-height: 1.6;">${message}</p>
          ${actionUrl ? `<a href="${actionUrl}" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">Voir les détails</a>` : ''}
        </div>
      </div>
    `
  }),

  passwordReset: (resetLink) => ({
    subject: "Réinitialisation de mot de passe",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border: 2px solid #ef4444; border-radius: 15px; padding: 30px;">
          <h2 style="color: #dc2626;">Réinitialisation de mot de passe</h2>
          <p style="color: #64748b;">Une demande de réinitialisation a été faite pour votre compte.</p>
          <a href="${resetLink}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0;">Réinitialiser le mot de passe</a>
          <p style="color: #94a3b8; font-size: 12px;">Ce lien expire dans 1 heure.</p>
        </div>
      </div>
    `
  }),

  modulePurchased: (moduleName, price) => ({
    subject: `Confirmation d'achat - ${moduleName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border: 2px solid #10b981; border-radius: 15px; padding: 30px;">
          <h2 style="color: #059669;">✓ Achat confirmé</h2>
          <p style="color: #64748b;">Merci pour votre achat!</p>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0; color: #166534;"><strong>Module:</strong> ${moduleName}</p>
            <p style="margin: 5px 0 0 0; color: #166534;"><strong>Prix:</strong> ${price} CAD</p>
          </div>
          <a href="https://druideomega.com/Shop" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Accéder au module</a>
        </div>
      </div>
    `
  })
};