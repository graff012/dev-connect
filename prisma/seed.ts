// import bcrypt from 'bcrypt';
// import { PrismaClient, Role } from '@prisma/client';
// import { Logger } from '@nestjs/common';
//
// const prisma = new PrismaClient();
// const admin_username = process.env.ADMIN_USERNAME;
// const admin_email = process.env.ADMIN_EMAIL;
// const admin_password = process.env.ADMIN_PASSWORD;
// const admin_role = process.env.ADMIN_ROLE;
// const logger = new Logger();
//
// if (!admin_username || !admin_password || !admin_email || !admin_role) {
//   throw new Error('Missing admin env variables ⚠️');
// }
//
// const main = async () => {
//   const hashedPass = await bcrypt.hash(admin_password, 12);
//
//   const findUser = await prisma.user.findUnique({
//     where: { email: admin_email },
//   });
//
//   if (!findUser) {
//     await prisma.user.create({
//       data: {
//         username: admin_username,
//         email: admin_email,
//         password: hashedPass,
//         role: admin_role as Role,
//       },
//     });
//     logger.log('Admin created successfully ✅');
//   } else if (findUser.role !== admin_role) {
//     await prisma.user.update({
//       where: { email: admin_email },
//       data: { role: admin_role as Role },
//     });
//     logger.log('Role added successfully ✅');
//   } else {
//     logger.log('Admin user already exists with correct role');
//   }
// };
//
// main()
//   .catch((e) => {
//     console.log(e);
//     process.exit(1);
//   })
//   .finally(() => prisma.$disconnect());
