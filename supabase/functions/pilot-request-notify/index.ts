const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type PilotRequest = {
  work_email?: string;
  company?: string;
  name?: string;
  phone?: string;
  team?: string;
  use_case?: string;
  primary_system?: string;
  manual_work?: string;
  team_size?: string;
  preferred_contact?: string;
  source_page?: string;
};

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function field(label: string, value?: string) {
  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e3e8e1;color:#6b746d;font-size:13px;font-weight:700;width:180px;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e3e8e1;color:#171a18;font-size:14px;">${escapeHtml(value || "Not provided")}</td>
    </tr>
  `;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const notifyTo = Deno.env.get("PILOT_NOTIFY_TO");
  const resendFrom = Deno.env.get("RESEND_FROM") || "Elevated AI <onboarding@resend.dev>";

  if (!resendApiKey || !notifyTo) {
    return new Response(JSON.stringify({ error: "Email notification is not configured." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }

  const lead = await request.json() as PilotRequest;
  const company = lead.company || "Unknown company";
  const subject = `New Elevated AI pilot request: ${company}`;

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#f8faf7;padding:24px;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e3e8e1;border-radius:8px;overflow:hidden;">
        <div style="background:#0f1712;color:#ffffff;padding:22px 24px;">
          <p style="color:#58d34f;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin:0 0 8px;">New pilot request</p>
          <h1 style="font-size:26px;line-height:1.15;margin:0;">${escapeHtml(company)}</h1>
        </div>
        <table style="border-collapse:collapse;width:100%;">
          ${field("Work email", lead.work_email)}
          ${field("Name", lead.name)}
          ${field("Phone", lead.phone)}
          ${field("Team", lead.team)}
          ${field("Team size", lead.team_size)}
          ${field("Use case", lead.use_case)}
          ${field("Primary system", lead.primary_system)}
          ${field("Preferred contact", lead.preferred_contact)}
          ${field("Source page", lead.source_page)}
        </table>
        <div style="padding:20px 24px;">
          <p style="color:#6b746d;font-size:13px;font-weight:800;margin:0 0 8px;">Manual work to automate first</p>
          <p style="color:#171a18;font-size:15px;line-height:1.55;margin:0;white-space:pre-wrap;">${escapeHtml(lead.manual_work || "Not provided")}</p>
        </div>
      </div>
    </div>
  `;

  const text = [
    subject,
    "",
    `Company: ${company}`,
    `Work email: ${lead.work_email || "Not provided"}`,
    `Name: ${lead.name || "Not provided"}`,
    `Phone: ${lead.phone || "Not provided"}`,
    `Team: ${lead.team || "Not provided"}`,
    `Team size: ${lead.team_size || "Not provided"}`,
    `Use case: ${lead.use_case || "Not provided"}`,
    `Primary system: ${lead.primary_system || "Not provided"}`,
    `Preferred contact: ${lead.preferred_contact || "Not provided"}`,
    `Source page: ${lead.source_page || "Not provided"}`,
    "",
    "Manual work to automate first:",
    lead.manual_work || "Not provided",
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom,
      to: [notifyTo],
      subject,
      html,
      text,
      reply_to: lead.work_email,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    return new Response(JSON.stringify({ error: "Resend email failed.", details }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});

