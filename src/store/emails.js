import emailjs from "emailjs-com";

export const sendEmail = async (recipientEmail, subject, message) => {
    const serviceId = "service_eav177o"; // Replace with your EmailJS Service ID
    const templateId = "template_v46m6nf"; // Replace with your EmailJS Template ID
    const userId = "QpTGpMUoNFLqrj_xX"; // Replace with your EmailJS User ID

    const templateParams = {
        to_email: recipientEmail, // Recipient's email address
        subject: subject, // Subject of the email
        message: message, // The email message body
    };

    try {
        const response = await emailjs.send(serviceId, templateId, templateParams, userId);
        console.log("Email sent successfully!", response.status, response.text);
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
};
