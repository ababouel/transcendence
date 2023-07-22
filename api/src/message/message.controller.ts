import { Controller, Get, Param, Patch } from '@nestjs/common';
import { IdDto } from 'src/common/dto/id-param.dto';
import { MessageService } from './message.service';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { subject } from '@casl/ability';
import { Message } from '@prisma/client';

@Controller('chat')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Get('/:id/messages')
  findFriendMessages(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: friendId }: IdDto,
  ) {
    return this.messageService.findFriendMessages(user, friendId);
  }

  @Get('/unread-messages')
  findUnreadMessages(@ActiveUser() user: ActiveUserData) {
    return this.messageService.findUnreadMessages(user);
  }

  @Patch('/read-message/:id/')
  async readMessage(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: messageId }: IdDto,
  ) {
    const message = await this.messageService.findOne(messageId);
    user.allow(
      'update',
      subject('Message', message),
      'isRead' as keyof Message,
    );
    return this.messageService.readMessage(messageId);
  }
}
