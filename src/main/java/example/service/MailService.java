package example.service;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class MailService {

    // Sender's email ID needs to be mentioned
    private final String from = "pembleco@gmail.com";
    private final String password = "pemblepass";

    private Properties getProps() {
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class",
                "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", "587");
        return props;
    }

    public void sendRegMail(String to, String code) {
//        String to = "adam-o-neill@live.com";

        Properties props = getProps();

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(from, password);
                    }
                });

        try {
            // Create a default MimeMessage object.
            Message message = new MimeMessage(session);

            // Set From: header field of the header.
            message.setFrom(new InternetAddress(from));

            // Set To: header field of the header.
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

            // Set Subject: header field
            message.setSubject("Pemble Registration");

            // Send the actual HTML message, as big as you like
            message.setContent("<h1>Welcome to Pemble</h1>\n" +
                    "<p>Here is your registration code:</p>\n" +
                    "<p>" + code + "</p>", "text/html");

            // Send message
            sendEmail(message);
        } catch (MessagingException mex) {
            mex.printStackTrace();
        }
    }

    public void sendNotification(String to, String msg) {


        Properties props = getProps();

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(from, password);
                    }
                });

        try {
            // Create a default MimeMessage object.
            Message message = new MimeMessage(session);

            // Set From: header field of the header.
            message.setFrom(new InternetAddress(from));

            // Set To: header field of the header.
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

            // Set Subject: header field
            message.setSubject("Pemble Notification");

            // Send the actual HTML message, as big as you like
            message.setContent("<h1>New notification</h1>\n" +
                    "<p>"+msg+"</p>\n", "text/html");

            // Send message
            sendEmail(message);
        } catch (MessagingException mex) {
            mex.printStackTrace();
        }
    }

    private void sendEmail(Message message) {
//        try {
//            Transport.send(message);
//        } catch (MessagingException mex) {
//            mex.printStackTrace();
//        }
    }
}
