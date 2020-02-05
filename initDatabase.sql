create database OnlineShoppingPlatform;
use OnlineShoppingPlatform;
-- #### 表汇总
-- | 表名         | 功能说明           |
-- | ------------ | ------------------ |
-- | UserInfo     | 单条用户信息       |
-- | UserState    | 用户屏蔽信息       |
-- | UserFriend   | 用户好友信息       |
-- | GoodInfo     | 单条商品信息       |
-- | Warehouse    | 用户仓库信息       |
-- | GoodComment  | 商品评论信息       |
-- | ShoppingCart | 购物车信息         |
-- | AdminInfo    | 单条管理员信息     |
-- | Notice       | 管理员留言信息     |
-- | Message      | 用户留言信息       |
-- | CustomPic    | 自定义个人空间背景 |


-- #### 表详情 
-- - **CustomPic**
-- | 列名    | 数据类型    | 空/非空  | 约束条件 | 备注 |
-- | ------- | ----------- | -------- | -------- | ---- |
-- | PicName | varchar(20) | not null | Unique   |      |
-- | PicPath | varchar(50) | not null | Unique   |      |
create table CustomPic
(
PicName varchar(20) not null Unique,
PicPath varchar(20) not null Unique
)ENGINE=InnoDB;

-- - **UserInfo**

-- | 列名          | 数据类型    | 空/非空  | 约束条件                       | 备注 |
-- | ------------- | ----------- | -------- | ------------------------------ | ---- |
-- | UserID        | int         | not null | Primary Key,Auto_increment     |      |
-- | UserLoginName | varchar(20) | not null | Unique                         |      |
-- | UserName      | varchar(20) | not null | Unique                         |      |
-- | UserPassword  | varchar(20) | not null |                                |      |
-- | Balance       | float       | not null |                                |      |
-- | UserImg       | varchar(50) |          |                                | 头像 |
-- | Custom        | varchar(20) | not null | Foreign Key(CustomPic.PicName) | 背景 |
create table UserInfo
(
UserID int not null primary key auto_increment,
UserLoginName varchar(20) not null Unique,
UserName varchar(20) not null Unique,
UserPassword varchar(20) not null,
Balance float not null,
UserImg varchar(50),
Custom varchar(20) not null,
Foreign Key (Custom) References CustomPic(PicName)
)ENGINE=InnoDB;

-- - **AdminInfo**

-- | 列名           | 数据类型    | 空/非空  | 约束条件                   | 备注 |
-- | -------------- | ----------- | -------- | -------------------------- | ---- |
-- | AdminID        | int         | not null | Primary Key,Auto_increment |      |
-- | AdminLoginName | varchar(20) | not null | Unique                     |      |
-- | AdminPassword  | varchar(20) | not null |                            |      |
-- | AdminName      | varchar(20) | not null | Unique                     |      |
create table AdminInfo
(
AdminID int not null Primary Key Auto_increment,
AdminLoginName varchar(20) not null Unique,
AdminPassword varchar(20) not null,
AdminName varchar(20) not null Unique
)ENGINE=InnoDB;

-- - **GoodInfo**
-- | 列名     | 数据类型      | 空/非空  | 约束条件                   | 备注     |
-- | -------- | ------------- | -------- | -------------------------- | -------- |
-- | GoodID   | int           | not null | Primary Key,Auto_increment |          |
-- | GoodName | varchar(20)   | not null | Unique                     |          |
-- | GoodImg  | varchar(50)   |          |                            |          |
-- | Owner    | varchar(20)   | not null |                            | 默认官方 |
-- | Price    | float         | not null |                            |          |
-- | Detail   | varchar(1000) | not null |                            |          |
create table GoodInfo
(
GoodID int not null Primary Key Auto_increment,
GoodName varchar(20) not null Unique,
GoodImg varchar(50),
Owner varchar(20) not null,
Price float not null,
Detail varchar(1000) not null
)ENGINE=InnoDB;

-- - **UserState**
-- | 列名    | 数据类型 | 空/非空  | 约束条件                       | 备注         |
-- | ------- | -------- | -------- | ------------------------------ | ------------ |
-- | UsderID | int      | not null | Foreign Key(UserInfo.UserID)   |              |
-- | State   | int      | not null |                                | 0正常，1禁言 |
-- | AdminID | int      |          | Foreign Key(AdminInfo.AdminID) | 封禁操作人   |
-- | Start   | date     |          |                                | 封禁时间     |
-- | Finish  | date     |          |                                | 解封时间     |
create table UserState
(
UserID int not null,
State int not null,
AdminID int,
Start date,
Finish date,
Foreign Key (UserID) References UserInfo(UserID),
Foreign Key (AdminID) References AdminInfo(AdminID)
)ENGINE=InnoDB;

-- - **UserFriend**
-- | 列名     | 数据类型 | 空/非空  | 约束条件                     | 备注 |
-- | -------- | -------- | -------- | ---------------------------- | ---- |
-- | UsderID  | int      | not null | Foreign Key(UserInfo.UserID) |      |
-- | FriendID | int      | not null | Foreign Key(UserInfo.UserID) |      |
create table UserFriend
(
UserID int not null,
FriendID int not null,
Foreign Key (UserID) References UserInfo(UserID),
Foreign Key (FriendID) References UserInfo(UserID)
)ENGINE=InnoDB;

-- - **Warehouse**
-- | 列名   | 数据类型 | 空/非空  | 约束条件                                     | 备注     |
-- | ------ | -------- | -------- | -------------------------------------------- | -------- |
-- | UserID | int      | not null | Foreign Key(UserInfo.UserID)                 |          |
-- | GoodID | int      | not null | Foreign Key(GoodInfo.GoodID)                 |          |
-- | Time   | date     | not null |                                              |          |
-- |        |          |          | Primary Key(UserInfo.UserID,GoodInfo.GoodID) | 联合主键 |
create table Warehouse
(
UserID int not null,
GoodID int not null,
Time date not null,
Foreign Key (UserID) References UserInfo(UserID),
Foreign Key (GoodID) References GoodInfo(GoodID),
primary key(UserID,GoodID)
)ENGINE=InnoDB;

-- - **GoodComment**
-- | 列名     | 数据类型     | 空/非空  | 约束条件                       | 备注        |
-- | -------- | ------------ | -------- | ------------------------------ | ----------- |
-- | GoodID   | int          | not null | Foreign Key(GoodInfo.GoodID)   |             |
-- | UserID   | int          | not null | Foreign Key(UserInfo.UserID)   |             |
-- | UserName | varchar(20)  | not null | Foreign Key(UserInfo.UserName) |             |
-- | Type     | int          | not null |                                | 0好评 1差评 |
-- | Time     | date         | not null |                                |             |
-- | Comment  | varchar(500) | not null |                                |             |
create table GoodComment
(
GoodID int not null,
UserID int not null,
UserName varchar(20) not null,
Type int not null,
Time date not null,
Comment varchar(500) not null,
Foreign Key (GoodID) References GoodInfo(GoodID),
Foreign Key (UserID) References UserInfo(UserID),
Foreign Key (UserName) References UserInfo(UserName)
)ENGINE=InnoDB;

--   - **ShoppingCart**
-- | 列名   | 数据类型 | 空/非空  | 约束条件                     | 备注 |
-- | ------ | -------- | -------- | ---------------------------- | ---- |
-- | UserID | int      | not null | Foreign Key(UserInfo.UserID) |      |
-- | GoodID | int      | not null | Foreign Key(GoodInfo.GoodID) |      |
create table ShoppingCart
(
UserID int not null,
GoodID int not null,
Foreign Key (GoodID) References GoodInfo(GoodID),
Foreign Key (UserID) References UserInfo(UserID)
)ENGINE=InnoDB;

-- - **Notice**
-- | 列名      | 数据类型     | 空/非空  | 约束条件                         | 备注 |
-- | --------- | ------------ | -------- | -------------------------------- | ---- |
-- | AdminID   | int          | not null | Foreign Key(AdminInfo.AdminID)   |      |
-- | UserID    | int          | not null | Foreign Key(UserInfo.UserID)     |      |
-- | AdminName | varchar(20)  |          | Foreign Key(AdminInfo.AdminName) |      |
-- | Notice    | varchar(500) | not null |                                  |      |
create table Notice
(
AdminId int not null,
UserId int not null,
AdminName varchar(20),
Notice varchar(500) not null,
Foreign Key (AdminID) References AdminInfo(AdminID),
Foreign Key (UserID) References UserInfo(UserID),
Foreign Key (AdminName) References AdminInfo(AdminName)
)ENGINE=InnoDB;

-- - **Message**
-- | 列名     | 数据类型     | 空/非空  | 约束条件                     | 备注 |
-- | -------- | ------------ | -------- | ---------------------------- | ---- |
-- | Sender   | int          | not null | Foreign Key(UserInfo.UserID) |      |
-- | Receiver | int          | not null | Foreign Key(UserInfo.UserID) |      |
-- | Message  | varchar(500) | not null |                              |      |
create table Message
(
Sender int not null,
Receiver int not null,
Message varchar(500) not null,
Foreign Key (Sender) References UserInfo(UserID),
Foreign Key (Receiver) References UserInfo(UserID)
)ENGINE=InnoDB;

