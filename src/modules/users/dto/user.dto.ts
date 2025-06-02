import { Expose, Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { formatDistanceToNow, isBefore, subDays } from 'date-fns';

export class UserDto {
  @Expose()
  id: string;

  @Exclude()
  password: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  @IsOptional()
  resume: string;

  @Expose()
  @IsOptional()
  bio: string;

  @Expose()
  @IsOptional()
  avatarUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  get formattedCreatedAt(): string {
    const oneWeekAgo = subDays(new Date(), 7);

    //if created within the past 7 days -> show the 'X days ago'
    if (isBefore(oneWeekAgo, this.createdAt)) {
      return formatDistanceToNow(this.createdAt, { addSuffix: true });
    }

    return this.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  @Expose()
  updatedAt: Date;

  @Expose()
  get formattedUpdatedAt(): string {
    const oneWeekAgo = subDays(new Date(), 7);

    if (isBefore(oneWeekAgo, this.updatedAt)) {
      return formatDistanceToNow(this.updatedAt, { addSuffix: true });
    }

    return this.updatedAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
