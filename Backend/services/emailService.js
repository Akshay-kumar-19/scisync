async function sendPasswordResetEmail({ toEmail, fullName, resetLink }) {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const nodemailer = require("nodemailer");

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: String(process.env.SMTP_SECURE || "false") === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: toEmail,
            subject: "Reset your SciSync account password",
            html: `
                <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#102a43">
                    <h2 style="margin-bottom:8px;">Password reset request</h2>
                    <p>Hello ${fullName || "User"},</p>
                    <p>We received a request to reset your password for the SciSync account.</p>
                    <p><a href="${resetLink}" style="display:inline-block;padding:12px 18px;background:#0f766e;color:#fff;text-decoration:none;border-radius:8px;">Reset Password</a></p>
                    <p>If you did not request this, you can ignore this email.</p>
                    <p>This link expires in 15 minutes.</p>
                </div>
            `
        });

        return { delivery: "smtp" };
    }

    return { delivery: "preview", resetLink };
}

module.exports = { sendPasswordResetEmail };
