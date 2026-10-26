# leslieryin.github.io

个人作品入口页 —— **<https://leslieryin.github.io/>**

把散在各个仓库里的实验台和工具收到一页上，一个链接就能看全貌。

## 页面上有什么

**四个在线实验台**，都是浏览器本地计算、零依赖、离线可用：

| 实验台 | 内容 |
|---|---|
| [control-lab](https://leslieryin.github.io/control-lab/) | 二阶系统阶跃响应、PID、Bode、Nyquist、根轨迹 |
| [modern-control-lab](https://leslieryin.github.io/modern-control-lab/) | 状态空间、能控能观、极点配置、状态观测器、卡尔曼滤波 |
| [process-control-lab](https://leslieryin.github.io/process-control-lab/) | FOPDT 与纯滞后、Smith 预估、串级、前馈-反馈 |
| [8086-emulator-lab](https://leslieryin.github.io/8086-emulator-lab/) | 8086 CPU + 8255/8253/8259/ADC0808，跑真实课设汇编 |

**四个小工具**：磁盘清理、B 站订阅、照片整理、Windows 体检。

## 为什么有这个页面

原来四个实验台分散在四个仓库、四条 Pages 路径下。想让人看全貌，得发四个链接。
现在发一个就够。

## 技术

单文件 `index.html`，内联样式，无 JS、无框架、无外部字体、无统计脚本。
唯一的网络请求是你点「在线打开」时跳转到对应的实验台。

```bash
# 本地看
python -m http.server 8000
# 打开 http://localhost:8000
```

## 许可

MIT
