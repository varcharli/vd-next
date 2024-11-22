// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module'; // 根据你的项目结构调整路径
// import { UserService } from './user/user.service'; // 根据你的项目结构调整路径
// import { DataSource } from 'typeorm';
// import { User } from '@/user/user.entity';
// import * as bcrypt from 'bcrypt';


// async function resetAdminPassword(newPassword: string) {
//     // const app = await NestFactory.create(AppModule);
//     const dataSource = new DataSource({
//         type: 'mysql', // or your database type
//         host: 'localhost',
//         port: 3306,
//         username: 'your-username',
//         password: 'your-password',
//         database: 'your-database',
//         entities: [User],
//         synchronize: true,
//     });
//     const userRepository=dataSource.getRepository(User);


//     const admin = await userRepository.findOne({ where: { name: 'admin' } });

//     if (admin) {
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       await userRepository.update(admin.id, { passwordHashed: hashedPassword });
//       console.log('Admin password has been reset successfully.');
//     } else {
//       console.log('Admin user not found.');
//     }
  
//     // 关闭数据源
//     await dataSource.destroy();
//   }
  
//   // 调用函数重置密码
//   const newPassword = 'ad12345'; // 设置新的密码
//   resetAdminPassword(newPassword).catch(error => console.error(error));