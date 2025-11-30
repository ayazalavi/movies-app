import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@movies-app.com' })
  email: string = "";

  @ApiProperty({ example: 'Pass123' })
  password: string = "";

  @ApiProperty({
    example: true,
    required: false,
    description: 'If true, keep user logged in for 30 days',
  })
  remember?: boolean;
}
