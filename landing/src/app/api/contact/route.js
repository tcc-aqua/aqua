import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { firstName, lastName, email, message } = await req.json();

    await resend.emails.send({
      from: "Contato Portfólio <onboarding@resend.dev>", 
      to: "servicesaquateam@gmail.com",
      subject: `Novo contato de ${firstName} ${lastName}`,
      text: `Email: ${email}\nMensagem: ${message}`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}