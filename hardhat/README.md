## 一些指令

npm初始化: npm init
安装hardhat: npm install --save-dev hardhat
创建hardhat项目: npx hardhat
编译项目: npx hardhat compile
运行测试: npx hardhat test
部署合约: npx hardhat deploy


## 一些常用包
安装指定的包: npm install @chainlink/contracts --save-dev
将私人信息存在.env文件中: npm install --save-dev dotenv
加密个人信息以供使用: npm install --save-dev @chainlink/env-enc
使用env-enc: 
- 添加密码: npx env-enc set-pw
- 设置元素: npx env-enc set(然后输入变量名和值)


## 查看npx指令
npx hardhat help