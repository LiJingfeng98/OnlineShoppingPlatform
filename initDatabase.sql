create database OnlineShoppingPlatform;

use OnlineShoppingPlatform;
-- #### 表汇总
-- | 表名         | 功能说明           |
-- | ------------ | ------------------ |
-- | UserInfo     | 单条用户信息       |
-- | Introduce    | 用户自我介绍       |
-- | UserState    | 用户屏蔽信息       |
-- | UserFriend   | 用户好友信息       |
-- | GoodInfo     | 单条商品信息       |
-- | GoodType     | 商品类别汇总       |
-- | Possessions  | 用户已拥有         |
-- | OrderList    | 订单列表           | 
-- | OrderDetails | 订单详情           |
-- | GoodComment  | 商品评论信息       |
-- | ShoppingCart | 购物车信息         |
-- | News         | 管理员留言信息     |
-- | Message      | 用户留言信息       |
-- | CustomPic    | 自定义个人空间背景 |


-- #### 表详情 
-- - **CustomPic**
-- | 列名    | 数据类型    | 空/非空  | 约束条件 | 备注 |
-- | ------- | ----------- | -------- | -------- | ---- |
-- | PicName | varchar(50) | not null | Unique   |      |
-- | PicPath | varchar(50) | not null | Unique   |      |
create table CustomPic
(
PicName varchar(50) not null Unique,
PicPath varchar(50) not null Unique
)ENGINE=InnoDB;

-- - **UserInfo**
-- | 列名          | 数据类型    | 空/非空  | 约束条件                       | 备注           |
-- | ------------- | ----------- | -------- | ------------------------------ | -------------- |
-- | UserID        | int         | not null | Primary Key,Auto_increment     |                |
-- | UserLoginName | varchar(20) | not null | Unique                         |                |
-- | UserName      | varchar(20) | not null | Unique                         |                |
-- | UserPassword  | varchar(20) | not null |                                |                |
-- | GrantP        | int         | not null |                                | 1管理员、0用户 |
-- | Balance       | float       | not null |                                |                |
-- | UserImg       | varchar(50) |          |                                | 头像           |
-- | Custom        | varchar(50) | not null | Foreign Key(CustomPic.PicPath) | 背景           |
create table UserInfo
(
UserID int not null primary key auto_increment,
UserLoginName varchar(20) not null Unique,
UserName varchar(20) not null Unique,
UserPassword varchar(20) not null,
GrantP int not null,
Balance float not null,
UserImg varchar(50),
Custom varchar(50) not null,
Foreign Key (Custom) References CustomPic(PicPath)
)ENGINE=InnoDB;

-- - **GoodInfo**
-- | 列名     | 数据类型      | 空/非空  | 约束条件                   | 备注           |
-- | -------- | ------------- | -------- | -------------------------- | -------------- |
-- | GoodID   | int           | not null | Primary Key,Auto_increment |                |
-- | GoodName | varchar(50)   | not null | Unique                     |                |
-- | GoodImg  | varchar(50)   | not null | Unique                     |                |
-- | Owner    | varchar(20)   | not null |                            | 默认官方       |
-- | RDate    | date          | not null |                            |                |
-- | Price    | float         | not null |                            |                |
-- | Detail   | varchar(1000) | not null |                            |                |
-- | Discount | float         | not null |                            | 默认为1        |
-- | Type     | int           | not null |                            | 1可退款，0不可 | 
create table GoodInfo
(
GoodID int not null Primary Key Auto_increment,
GoodName varchar(50) not null Unique,
GoodImg varchar(50) not null unique,
Owner varchar(50) not null,
RDate date not null,
Price float not null,
Detail varchar(1000) not null,
Discount float not null,
Type int not null
)ENGINE=InnoDB;

-- - **GoodType**
-- | 列名   | 数据类型    | 空/非空  | 约束条件                     | 备注 |
-- | ------ | ----------- | -------- | ---------------------------- | ---- |
-- | GoodID | int         | not null | Foreign Key(GoodInfo.GoodID) |      |
-- | Type   | varchar(20) | not null |                              |      |
-- | Num    | int         | not null |                              |      |
-- |        |             |          | Unique(GoodID,Type)          |      |
create table GoodType
(
GoodID int not null,
Type varchar(20) not null,
Num int not null,
Foreign Key (GoodID) References GoodInfo(GoodID),
UNIQUE (GoodID,Type)
)ENGINE=InnoDB;

-- - **UserState**
-- | 列名    | 数据类型 | 空/非空  | 约束条件                    | 备注         |
-- | ------- | -------- | -------- | --------------------------- | ------------ |
-- | UsderID | int      | not null | Foreign Key(UserInfo.UserID)|              |
-- | Finish  | date     |          |                             | 解封时间     |
create table UserState
(
UserID int not null,
Finish date,
Foreign Key (UserID) References UserInfo(UserID)
)ENGINE=InnoDB;

-- - **UserFriend**
-- | 列名     | 数据类型 | 空/非空  | 约束条件                     | 备注 |
-- | -------- | -------- | -------- | ---------------------------- | ---- |
-- | UsderID  | int      | not null | Foreign Key(UserInfo.UserID) |      |
-- | FriendID | int      | not null | Foreign Key(UserInfo.UserID) |      |
-- |          |          |          | Unique(UserID,FriendID)      |      |
create table UserFriend
(
UserID int not null,
FriendID int not null,
Foreign Key (UserID) References UserInfo(UserID),
Foreign Key (FriendID) References UserInfo(UserID),
UNIQUE (UserID,FriendID)
)ENGINE=InnoDB;

-- - **Possessions**
-- | 列名   | 数据类型 | 空/非空  | 约束条件                                     | 备注     |
-- | ------ | -------- | -------- | -------------------------------------------- | -------- |
-- | UserID | int      | not null | Foreign Key(UserInfo.UserID)                 |          |
-- | GoodID | int      | not null | Foreign Key(GoodInfo.GoodID)                 |          |
-- | Time   | date     | not null |                                              |          |
-- |        |          |          | Primary Key(UserInfo.UserID,GoodInfo.GoodID) | 联合主键 |
create table Possessions
(
UserID int not null,
GoodID int not null,
Time date not null,
Foreign Key (UserID) References UserInfo(UserID),
Foreign Key (GoodID) References GoodInfo(GoodID),
primary key(UserID,GoodID)
)ENGINE=InnoDB;

-- - **OrderList**
-- | 列名    | 数据类型 | 空/非空  | 约束条件                     | 备注                     |
-- | ------- | -------- | -------- | ---------------------------- | ------------------------ |
-- | OrderID | int      | not null | Primary Key,Auto_increment   |                          |
-- | UserID  | int      | not null | Foreign Key(UserInfo.UserID) |                          |
-- | Time    | date     | not null |                              |                          |
-- | Amount  | float    | not null |                              |                          |
create table OrderList
(
OrderID int not null Primary Key Auto_increment,
UserID int not null,
Time date not null,
Amount float not null,
Foreign Key (UserID) References UserInfo(UserID)
)ENGINE=InnoDB;

-- - **OrderDetails**
-- | 列名    | 数据类型 | 空/非空  | 约束条件                       | 备注                     |
-- | ------- | -------- | -------- | ------------------------------ | ------------------------ |
-- | OrderID | int      | not null | Foreign Key(OrderList.OrderID) |                          |
-- | GoodID  | int      | not null | Foreign Key(GoodInfo.GoodID)   |                          |
-- | Price   | float    | not null |                                |                          |
-- | Type    | int      | not null |                                | 1可退款，0不可,2为已退款 |
create table OrderDetails
(
OrderID int not null,
GoodID int not null,
Price float not null,
Type int not null,
Foreign Key (OrderID) References OrderList(OrderID),
Foreign Key (GoodID) References GoodInfo(GoodID)
)ENGINE=InnoDB;

-- - **GoodComment**
-- | 列名     | 数据类型     | 空/非空  | 约束条件                       | 备注        |
-- | -------- | ------------ | -------- | ------------------------------ | ----------- |
-- | GoodID   | int          | not null | Foreign Key(GoodInfo.GoodID)   |             |
-- | UserID   | int          | not null | Foreign Key(UserInfo.UserID)   |             |
-- | Type     | int          | not null |                                | 0好评 1差评 |
-- | Time     | date         | not null |                                |             |
-- | Comment  | varchar(500) | not null |                                |             |
create table GoodComment
(
GoodID int not null,
UserID int not null,
Type int not null,
Time date not null,
Comment varchar(500) not null,
Foreign Key (GoodID) References GoodInfo(GoodID),
Foreign Key (UserID) References UserInfo(UserID)
)ENGINE=InnoDB;

--   - **ShoppingCart**
-- | 列名   | 数据类型 | 空/非空  | 约束条件                     | 备注 |
-- | ------ | -------- | -------- | ---------------------------- | ---- |
-- | UserID | int      | not null | Foreign Key(UserInfo.UserID) |      |
-- | GoodID | int      | not null | Foreign Key(GoodInfo.GoodID) |      |
-- |        |          |          | Unique(UserID,GoodID)        |      |
create table ShoppingCart
(
UserID int not null,
GoodID int not null,
Foreign Key (GoodID) References GoodInfo(GoodID),
Foreign Key (UserID) References UserInfo(UserID),
UNIQUE (UserID,GoodID)
)ENGINE=InnoDB;

-- - **News**
-- | 列名   | 数据类型      | 空/非空  | 约束条件                   | 备注 |
-- | ------ | ------------- | -------- | -------------------------- | ---- |
-- | ID     | int           | not null | Primary Key,Auto_increment |      |
-- | Title  | varchar(50)   | not null |                            |      |
-- | Time   | Date          | not null |                            |      |
-- | Detail | varchar(1000) | not null |                            |      |
create table News
(
ID int not null primary key auto_increment,
Title varchar(50) not null,
Time date not null,
Detail varchar(1000) not null
)ENGINE=InnoDB;

-- - **Message**
-- | 列名     | 数据类型     | 空/非空  | 约束条件                     | 备注 |
-- | -------- | ------------ | -------- | ---------------------------- | ---- |
-- | ID       | int          | not null | Primary Key,Auto_increment   |      |
-- | Sender   | int          | not null | Foreign Key(UserInfo.UserID) |      |
-- | Receiver | int          | not null | Foreign Key(UserInfo.UserID) |      |
-- | Time     | Date         | not null |                              |      |
-- | Message  | varchar(500) | not null |                              |      |
create table Message
(
id int not null primary key Auto_increment,
Sender int not null,
Receiver int not null,
Time date not null,
Message varchar(500) not null,
Foreign Key (Sender) References UserInfo(UserID),
Foreign Key (Receiver) References UserInfo(UserID)
)ENGINE=InnoDB;

-- - **Introduce**

-- | 列名      | 数据类型     | 空/非空  | 约束条件                     | 备注 |
-- | --------- | ------------ | -------- | ---------------------------- | ---- |
-- | UserID    | int          | not null | Foreign Key(UserInfo.UserID) |      |
-- | Introduce | varchar(500) |          |                              |      |
create table Introduce
(
UserId int not null,
Introduce varchar(500),
 Foreign Key (UserId) References UserInfo(UserID)
)ENGINE=InnoDB;