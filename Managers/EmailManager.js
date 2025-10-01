import nodemailer from "nodemailer";

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service:"gmail",
      port: 587,
      secure: false,
      auth: {
        user: "open.study.04@gmail.com",
        pass: "tioatimjoxyhmvct",
      },
    });
  }

  async sendEmail(type, data, recipient) {
    let subject = "";
    let html = "";

    switch (type) {
      case "quiz":
        subject = `Quiz Notification: ${data.quizName}`;
        html = `
          <h2>Quiz Details</h2>
          <p><b>Name:</b> ${data.quizName}</p>
          <p><b>Subject:</b> ${data.quizSubject}</p>
          <p><b>Marks:</b> ${data.quizMarks}</p>
        `;
        break;
      case "assignment":
        subject = `Assignment Notification: ${data.assignmentName}`;
        html = `
          <h2>Assignment Details</h2>
          <p><b>Name:</b> ${data.assignmentName}</p>
          <p><b>Details:</b> ${data.assignmentDetails}</p>
          <p><b>Due Date:</b> ${data.assignmentDueDate}</p>
        `;
        break;
      default:
        console.log("Invalid email type provided to EmailManager");
        return;
    }

    const mailOptions = {
      from: `"Open Study Platform" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject,
      html,
    };

    try {
        let info = await this.transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending email:", error);
    }
  }
}

export default EmailManager;