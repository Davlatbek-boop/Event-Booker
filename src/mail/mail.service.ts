import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "../users/entities/user.entity";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(user: User) {
    const url = `${process.env.API_URL}/api/users/activate/${user.activation_link}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome to Event Booker! Please confirm your email",
      template: "./activation",
      context: {
        name: user.user_name.split(" ")[0],
        url,
        year: new Date().getFullYear(),
      },
    });
  }



  async sendMailNewEvent(info:object, email:string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "New Event Created",
      template: "./send-event",
      context: info
    });
  }

  
}
