import sgMail from '@sendgrid/mail'

export interface EmailData {
  to: string
  subject: string
  html: string
}

export class SendGridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
  }

  async sendEmail(data: EmailData) {
    try {
      const msg = {
        to: data.to,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: data.subject,
        html: data.html,
      }
      
      await sgMail.send(msg)
      console.log('Email sent successfully')
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }

  // Email de confirmation au candidat
  async sendCandidateConfirmation(candidate: {
    firstName: string
    lastName: string
    email: string
    position: string
  }) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8D0000;">Merci pour votre candidature !</h2>
        
        <p>Bonjour ${candidate.firstName} ${candidate.lastName},</p>
        
        <p>Nous avons bien reçu votre candidature pour le poste de <strong>${candidate.position}</strong>.</p>
        
        <p>Notre équipe va examiner votre profil et nous vous recontacterons dans les plus brefs délais.</p>
        
        <p>En attendant, n'hésitez pas à nous contacter si vous avez des questions.</p>
        
        <p>Cordialement,<br>
        L'équipe TheBridge RH</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          Cet email a été envoyé automatiquement suite à votre candidature sur notre site.
        </p>
      </div>
    `

    await this.sendEmail({
      to: candidate.email,
      subject: `Confirmation de candidature - ${candidate.position}`,
      html,
    })
  }

  // Email de notification à l'admin
  async sendAdminNotification(candidate: {
    firstName: string
    lastName: string
    email: string
    position: string
    skills: string
  }) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8D0000;">Nouvelle candidature reçue</h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Informations du candidat :</h3>
          <p><strong>Nom :</strong> ${candidate.firstName} ${candidate.lastName}</p>
          <p><strong>Email :</strong> ${candidate.email}</p>
          <p><strong>Poste recherché :</strong> ${candidate.position}</p>
          <p><strong>Compétences :</strong> ${candidate.skills}</p>
        </div>
        
        <p>Connectez-vous à votre tableau de bord pour examiner cette candidature et prendre les prochaines étapes.</p>
        
        <p style="margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://thebridgerh-app.vercel.app'}/admin" 
             style="background: #8D0000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Accéder au tableau de bord
          </a>
        </p>
      </div>
    `

    await this.sendEmail({
      to: process.env.SENDGRID_ADMIN_EMAIL!,
      subject: `Nouvelle candidature - ${candidate.firstName} ${candidate.lastName}`,
      html,
    })
  }
} 