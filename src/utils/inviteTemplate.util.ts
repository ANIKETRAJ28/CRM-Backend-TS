export function inviteTemplate(
  email: string,
  orgName: string,
  invite: string
): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>NexusCRM Organization Invite</title>
    <style>
      /* General resets and font styling */
      body {
        margin: 0;
        padding: 0;
        background-color: #f9fafb;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
      }
      /* Header / Navbar */
      .navbar {
        background-color: #1e3a8a;
        padding: 16px;
        text-align: center;
      }
      .navbar .logo {
        font-size: 24px;
        font-weight: bold;
        background: white;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      /* Content section */
      .content {
        padding: 24px;
      }
      .content h1 {
        color: #1e3a8a;
        margin-bottom: 16px;
      }
      .content p {
        color: #374151;
        line-height: 1.5;
        margin-bottom: 16px;
      }
      .invite-box {
        background-color: #f1f5f9;
        border: 1px dashed #3b82f6;
        border-radius: 4px;
        text-align: center;
        margin: 24px 0;
        padding: 16px;
        font-size: 24px;
        font-weight: bold;
        color: #1e3a8a;
      }
      /* Footer styling */
      .footer {
        background-color: #1e3a8a;
        color: #ffffff;
        text-align: center;
        padding: 16px;
        font-size: 14px;
      }
      a {
        color: #3b82f6;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header / Navbar -->
      <div class="navbar">
        <span class="logo">NexusCRM</span>
      </div>
      <!-- Main Content -->
      <div class="content">
        <h1>You're Invited!</h1>
        <p>Hello,</p>
        <p>
          You have been invited to join the organization <strong>${orgName}</strong> on NexusCRM.
          Please use the invite code below to accept your invitation and get started.
        </p>
        <div class="invite-box">${invite}</div>
        <p>
          Your registered email address: <strong>${email}</strong>
        </p>
        <p>
          If you did not expect this invite, please disregard this message or contact your organization administrator.
        </p>
        <p>
          Thank you, <br />
          The NexusCRM Team
        </p>
      </div>
      <!-- Footer -->
      <div class="footer">
        &copy; 2025 NexusCRM. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;
}
