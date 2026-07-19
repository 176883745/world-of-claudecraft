# AI Bot Framework

自动玩游戏的游戏内机器人框架，支持多账号和 AI 增强互动。

## 功能特性

- **自动玩游戏**：自动打怪、做任务、升级
- **AI 增强聊天**：可选的 LLM 集成，让机器人像真人一样聊天
- **多账号支持**：同时运行多个机器人账号
- **行为配置**：可配置不同的行为模式（grinder、quester、social）
- **自动重连**：断线自动重连

## 配置方式

支持三种配置方式，优先级从高到低：

1. **命令行参数**：`--config path/to/config.json`
2. **环境变量**：`AIBOT_USERNAME` + `AIBOT_PASSWORD`，或 `AIBOT_ACCOUNTS`
3. **默认配置文件**：`aibot/config.json`

推荐新手使用 **配置文件**。

---

## 方法 1：配置文件（推荐）

### 1. 复制示例配置文件

```bash
cp aibot/config.example.json aibot/config.json
```

### 2. 编辑 `aibot/config.json`

```json
{
  "serverUrl": "http://127.0.0.1:8787",
  "logLevel": "info",
  "tickInterval": 50,
  "reconnect": {
    "maxAttempts": 10,
    "baseDelayMs": 1000,
    "maxDelayMs": 30000
  },
  "accounts": [
    {
      "name": "bot1",
      "username": "your_bot_username",
      "password": "your_bot_password",
      "behavior": "grinder",
      "enableAIChat": false
    }
  ]
}
```

### 3. 运行

```bash
npm run aibot
```

---

## 方法 2：环境变量

### 单账号

```bash
export AIBOT_USERNAME="your_bot_username"
export AIBOT_PASSWORD="your_bot_password"
export AIBOT_BEHAVIOR="grinder"
export AIBOT_ENABLE_AI_CHAT="false"

npm run aibot
```

### 多账号

```bash
export AIBOT_ACCOUNTS='[
  {
    "name": "bot1",
    "username": "bot1_account",
    "password": "bot1_password",
    "behavior": "grinder",
    "enableAIChat": false
  },
  {
    "name": "bot2",
    "username": "bot2_account",
    "password": "bot2_password",
    "behavior": "social",
    "enableAIChat": true
  }
]'

npm run aibot
```

---

## 方法 3：命令行参数

```bash
npm run aibot -- --config /path/to/my-config.json
```

---

## AI 聊天配置（可选）

在配置文件中启用 LLM：

```json
{
  "ai": {
    "apiEndpoint": "https://api.openai.com/v1",
    "apiKey": "your_api_key_here",
    "model": "gpt-4o-mini",
    "systemPrompt": "You are a helpful MMO game player."
  }
}
```

或在环境变量中设置：

```bash
export AIBOT_AI_API_KEY="your_api_key"
export AIBOT_AI_MODEL="gpt-4o-mini"
```

## 行为模式

| 模式 | 描述 |
|------|------|
| `grinder` | 自动打怪升级，优先攻击最近的敌人 |
| `quester` | 优先完成任务目标 |
| `social` | 专注于社交互动，响应聊天和组队邀请 |
| `custom` | 自定义行为脚本（需要额外配置） |

## 架构

```
aibot/
├── config.ts           # 配置加载
├── config.example.json # 示例配置文件
├── protocol.ts         # WebSocket 协议定义
├── client.ts           # 游戏客户端（REST + WebSocket）
├── perception.ts       # 世界状态感知
├── brain.ts            # 决策引擎（FSM 状态机）
├── ai.ts               # AI 增强模块
├── manager.ts          # 多账号管理器
└── main.ts             # 入口
```

### 核心组件

- **BotClient**：处理 REST API 登录和 WebSocket 连接
- **Brain**：有限状态机决策引擎，决定机器人行为
- **AIModule**：可选的 LLM 集成，生成自然语言回复
- **BotManager**：管理多个机器人实例的生命周期

## 状态机

```
idle -> engaging -> fighting -> looting -> idle
         ^            |
       resting <- (low health)
```

| 状态 | 行为 |
|------|------|
| `idle` | 寻找目标或等待 |
| `engaging` | 接近敌人 |
| `fighting` | 战斗中，释放技能 |
| `looting` | 拾取战利品 |
| `resting` | 低血量时休息 |
| `socializing` | 处理社交互动 |

## 扩展

### 添加新的行为

在 `brain.ts` 中添加新的状态处理器：

```typescript
private handleNewState(ctx: BotContext): StateTransition | null {
  // 实现你的逻辑
  return { nextState: 'idle' };
}
```

### 添加新的技能循环

在 `performCombatRotation` 中添加职业特定的技能逻辑：

```typescript
if (classType === 'your_class') {
  if (!self.cooldowns['your_ability']) {
    this.client.sendCommand('useAbility', { ability: 'your_ability', target: target.id });
  }
}
```

## 注意事项

- 确保游戏服务器正在运行
- 机器人账号需要提前创建
- AI 聊天需要有效的 LLM API key
- 多账号模式下，每个账号消耗一个服务器连接
- 不要在 Git 中提交包含真实密码的 `aibot/config.json`