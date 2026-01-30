// 全局变量
let currentSection = 'home';
let currentSystem = null;
let currentPath = [];
let systemData = [];

// 设备标识，用于权限控制
let deviceId = localStorage.getItem('deviceId');
if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('deviceId', deviceId);
}

// 生成设备ID
function generateDeviceId() {
    return 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// 分享功能相关函数

// 复制链接到剪贴板
function copyLinkToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => {
            showStatusMessage('链接已复制到剪贴板！', 'success');
        })
        .catch(err => {
            console.error('复制链接失败:', err);
            showStatusMessage('复制链接失败，请手动复制', 'error');
        });
}

// 显示状态消息
function showStatusMessage(message, type = 'info') {
    const statusElement = document.getElementById('upload-status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `upload-status ${type}`;
        
        // 3秒后自动清除消息
        setTimeout(() => {
            statusElement.textContent = '';
            statusElement.className = 'upload-status';
        }, 3000);
    }
}

// 从URL中解析系统数据
function parseSystemDataFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    
    if (encodedData) {
        try {
            const jsonData = decodeURIComponent(escape(atob(encodedData)));
            const parsedData = JSON.parse(jsonData);
            
            if (Array.isArray(parsedData)) {
                systemData = parsedData;
                renderSystemList();
                showStatusMessage('成功从分享链接加载系统数据', 'success');
            }
        } catch (err) {
            console.error('解析分享链接数据失败:', err);
            showStatusMessage('解析分享链接数据失败', 'error');
        }
    }
}

// 示例数据 - 飞机系统框架
const defaultSystemData = [
    {
        id: '1',
        name: '动力系统',
        description: '飞机的动力来源系统',
        children: [
            {
                id: '1-1',
                name: '发动机',
                description: '提供飞机前进的动力',
                children: [
                    {
                        id: '1-1-1',
                        name: '涡轮风扇发动机',
                        description: '现代民航飞机主要使用的发动机类型',
                        children: []
                    },
                    {
                        id: '1-1-2',
                        name: '涡轮螺旋桨发动机',
                        description: '小型飞机常用的发动机类型',
                        children: []
                    }
                ]
            },
            {
                id: '1-2',
                name: '燃油系统',
                description: '存储和供应燃油的系统',
                children: [
                    {
                        id: '1-2-1',
                        name: '燃油箱',
                        description: '存储燃油的容器',
                        children: []
                    },
                    {
                        id: '1-2-2',
                        name: '燃油泵',
                        description: '将燃油从油箱输送到发动机',
                        children: []
                    }
                ]
            }
        ]
    },
    {
        id: '2',
        name: '飞行控制系统',
        description: '控制飞机飞行姿态的系统',
        children: [
            {
                id: '2-1',
                name: '主飞行控制系统',
                description: '控制飞机的升降、倾斜和偏航',
                children: [
                    {
                        id: '2-1-1',
                        name: '升降舵',
                        description: '控制飞机的俯仰',
                        children: []
                    },
                    {
                        id: '2-1-2',
                        name: '副翼',
                        description: '控制飞机的滚转',
                        children: []
                    },
                    {
                        id: '2-1-3',
                        name: '方向舵',
                        description: '控制飞机的偏航',
                        children: []
                    }
                ]
            },
            {
                id: '2-2',
                name: '自动飞行系统',
                description: '自动驾驶和自动导航系统',
                children: [
                    {
                        id: '2-2-1',
                        name: '自动驾驶仪',
                        description: '自动控制飞机飞行',
                        children: []
                    },
                    {
                        id: '2-2-2',
                        name: '飞行管理系统',
                        description: '管理飞行计划和导航',
                        children: []
                    }
                ]
            }
        ]
    },
    {
        id: '3',
        name: '航空电子系统',
        description: '飞机的电子设备系统',
        children: [
            {
                id: '3-1',
                name: '通信系统',
                description: '飞机与地面和其他飞机的通信',
                children: []
            },
            {
                id: '3-2',
                name: '导航系统',
                description: '帮助飞机确定位置和航向',
                children: []
            },
            {
                id: '3-3',
                name: '仪表系统',
                description: '显示飞机状态和飞行参数',
                children: []
            }
        ]
    },
    {
        id: '4',
        name: '机身系统',
        description: '飞机的主体结构系统',
        children: [
            {
                id: '4-1',
                name: '机翼',
                description: '产生升力的主要部件',
                children: []
            },
            {
                id: '4-2',
                name: '机身',
                description: '容纳人员和货物的主体结构',
                children: []
            },
            {
                id: '4-3',
                name: '起落架',
                description: '飞机起飞和降落的支撑系统',
                children: []
            }
        ]
    },
    {
        id: '5',
        name: '环境控制系统',
        description: '维持飞机内部环境的系统',
        children: [
            {
                id: '5-1',
                name: '空调系统',
                description: '调节机舱温度和湿度',
                children: []
            },
            {
                id: '5-2',
                name: '增压系统',
                description: '维持机舱内的气压',
                children: []
            }
        ]
    }
];

// 初始化应用
function initApp() {
    // 初始化为空数组，移除默认系统列表
    systemData = [];
    
    // 解析URL中的系统数据（如果有）
    parseSystemDataFromUrl();
    
    // 绑定事件监听器
    document.getElementById('back-btn').addEventListener('click', goBack);
    document.getElementById('home-btn').addEventListener('click', goHome);
    document.getElementById('parse-btn').addEventListener('click', parseMindmap);
    document.getElementById('mindmap-upload').addEventListener('change', handleFileUpload);
    
    // 绑定分享功能按钮事件
    const copyLinkBtn = document.getElementById('copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', copyLinkToClipboard);
    }
    
    // 渲染系统列表
    renderSystemList();
    
    // 加载本地存储的思维导图数据
    loadLocalMindmaps();
}

// 同步系统数据
function syncSystemData() {
    // 本地存储已经在保存时自动同步，这里可以留空或添加额外的同步逻辑
    console.log('系统数据已同步到本地存储');
    // 重新加载本地思维导图数据以确保数据最新
    loadLocalMindmaps();
}

// 渲染系统列表
function renderSystemList() {
    const systemList = document.getElementById('system-list');
    systemList.innerHTML = '';
    
    if (systemData.length === 0) {
        systemList.innerHTML = '<p class="empty-message">请上传思维导图以生成系统列表</p>';
        return;
    }
    
    systemData.forEach((system, index) => {
        const systemItem = document.createElement('div');
        systemItem.className = 'system-item';
        systemItem.dataset.id = system.id;
        systemItem.dataset.index = index;
        systemItem.draggable = true;
        systemItem.innerHTML = `
            <h3>${system.name}</h3>
            <p>${system.description}</p>
        `;
        
        // 添加拖放事件监听器
        systemItem.addEventListener('dragstart', handleDragStart);
        systemItem.addEventListener('dragover', handleDragOver);
        systemItem.addEventListener('drop', handleDrop);
        
        // 添加点击事件监听器
        systemItem.addEventListener('click', () => navigateToSystem(system));
        
        systemList.appendChild(systemItem);
    });
}

// 拖动开始事件处理
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
}

// 拖动经过事件处理
function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('dragover');
}

// 放置事件处理
function handleDrop(e) {
    e.preventDefault();
    
    // 移除所有拖放相关的样式
    document.querySelectorAll('.system-item').forEach(item => {
        item.classList.remove('dragging', 'dragover');
    });
    
    // 获取拖动项和目标项的索引
    const draggedIndex = parseInt(draggedItem.dataset.index);
    const targetIndex = parseInt(this.dataset.index);
    
    // 重新排序系统数据
    if (draggedIndex !== targetIndex) {
        const [movedSystem] = systemData.splice(draggedIndex, 1);
        systemData.splice(targetIndex, 0, movedSystem);
        
        // 重新渲染系统列表
        renderSystemList();
    }
    
    draggedItem = null;
}

// 导航到系统详情页
function navigateToSystem(system) {
    currentSystem = system;
    currentPath = [system];
    
    // 更新页面标题
    document.getElementById('page-title').textContent = system.name;
    document.getElementById('system-title').textContent = system.name;
    
    // 显示返回按钮
    document.getElementById('back-btn').style.display = 'inline-block';
    document.getElementById('home-btn').style.display = 'inline-block';
    
    // 切换到系统详情页
    document.getElementById('home-section').classList.remove('active');
    document.getElementById('system-section').classList.add('active');
    currentSection = 'system';
    
    // 渲染子系统列表
    renderSubsystemList(system.children);
}

// 导航到子系统
function navigateToSubsystem(subsystem) {
    currentPath.push(subsystem);
    
    // 更新页面标题
    document.getElementById('page-title').textContent = subsystem.name;
    document.getElementById('system-title').textContent = subsystem.name;
    
    // 渲染子系统列表
    renderSubsystemList(subsystem.children);
}

// 渲染子系统列表
function renderSubsystemList(subsystems) {
    const subsystemList = document.getElementById('subsystem-list');
    subsystemList.innerHTML = '';
    
    if (subsystems.length === 0) {
        subsystemList.innerHTML = '<p>该系统没有子系统</p>';
        return;
    }
    
    subsystems.forEach(subsystem => {
        const subsystemItem = document.createElement('div');
        subsystemItem.className = 'subsystem-item';
        subsystemItem.dataset.id = subsystem.id;
        subsystemItem.innerHTML = `
            <h3>${subsystem.name}</h3>
            <p>${subsystem.description}</p>
        `;
        subsystemItem.addEventListener('click', () => navigateToSubsystem(subsystem));
        subsystemList.appendChild(subsystemItem);
    });
}

// 返回上一级
function goBack() {
    if (currentPath.length > 1) {
        currentPath.pop();
        const previousItem = currentPath[currentPath.length - 1];
        
        // 更新页面标题
        document.getElementById('page-title').textContent = previousItem.name;
        document.getElementById('system-title').textContent = previousItem.name;
        
        // 渲染上一级的子系统列表
        renderSubsystemList(previousItem.children);
    } else {
        // 返回主页
        goHome();
    }
}

// 返回主页
function goHome() {
    currentSection = 'home';
    currentSystem = null;
    currentPath = [];
    
    // 更新页面标题
    document.getElementById('page-title').textContent = '飞机系统框架学习';
    
    // 隐藏返回按钮
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('home-btn').style.display = 'none';
    
    // 切换到主页
    document.getElementById('system-section').classList.remove('active');
    document.getElementById('home-section').classList.add('active');
}

// 处理文件上传
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('upload-status').textContent = `已选择文件: ${file.name}`;
    }
}

// 解析思维导图
function parseMindmap() {
    const fileInput = document.getElementById('mindmap-upload');
    const file = fileInput.files[0];
    
    if (!file) {
        showStatusMessage('请选择要解析的思维导图文件', 'error');
        return;
    }
    
    showStatusMessage('正在解析思维导图...', 'info');
    
    if (file.name.endsWith('.md')) {
        parseMDFile(file);
    } else if (file.name.endsWith('.xmind') || file.name.endsWith('.xmindz')) {
        parseXMindFile(file);
    } else {
        showStatusMessage('不支持的文件格式，请上传 .md 或 .xmind 文件', 'error');
    }
}

// 加载本地存储的思维导图数据
function loadLocalMindmaps() {
    try {
        // 加载本地存储的思维导图数据
        const localMindmaps = localStorage.getItem('localMindmaps');
        if (localMindmaps) {
            const parsedMindmaps = JSON.parse(localMindmaps);
            
            // 过滤出当前设备上传的思维导图
            const currentDeviceMindmaps = parsedMindmaps.filter(mindmap => mindmap.deviceId === deviceId);
            
            // 过滤出公共思维导图（所有设备可见）
            const publicMindmaps = parsedMindmaps.filter(mindmap => mindmap.isPublic);
            
            // 合并数据
            const allVisibleMindmaps = [...currentDeviceMindmaps, ...publicMindmaps];
            
            // 合并系统数据
            if (allVisibleMindmaps.length > 0) {
                systemData = [];
                allVisibleMindmaps.forEach(mindmap => {
                    if (Array.isArray(mindmap.data)) {
                        systemData = [...systemData, ...mindmap.data];
                    }
                });
                renderSystemList();
                showStatusMessage(`成功加载 ${allVisibleMindmaps.length} 个思维导图`, 'success');
            }
        }
    } catch (err) {
        console.error('加载本地思维导图失败:', err);
        showStatusMessage('加载本地思维导图失败', 'error');
    }
}

// 保存思维导图数据到本地存储
function saveMindmapToLocal(data, isPublic = true) {
    try {
        // 加载现有的思维导图数据
        const localMindmaps = localStorage.getItem('localMindmaps');
        let existingMindmaps = [];
        
        if (localMindmaps) {
            existingMindmaps = JSON.parse(localMindmaps);
        }
        
        // 创建新的思维导图记录
        const newMindmap = {
            id: 'mindmap_' + Date.now(),
            deviceId: deviceId,
            isPublic: isPublic,
            data: data,
            timestamp: Date.now()
        };
        
        // 添加到现有数据中
        existingMindmaps.push(newMindmap);
        
        // 保存到本地存储
        localStorage.setItem('localMindmaps', JSON.stringify(existingMindmaps));
        
        return true;
    } catch (err) {
        console.error('保存思维导图到本地失败:', err);
        return false;
    }
}

// 解析.md格式文件
function parseMDFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            
            // 解析Markdown内容
            const mindmapData = parseMarkdownContent(content);
            
            // 转换思维导图数据为系统数据格式
            const convertedData = convertMindmapToSystemData(mindmapData);
            
            // 保存到本地存储（当前设备上传的内容设为公共，其他设备可见）
            const saved = saveMindmapToLocal(convertedData, true);
            
            // 更新系统数据
            systemData = convertedData;
            
            // 重新渲染系统列表
            renderSystemList();
            
            if (saved) {
                showStatusMessage('思维导图解析成功并已保存！', 'success');
            } else {
                showStatusMessage('思维导图解析成功但保存失败', 'warning');
            }
        } catch (error) {
            showStatusMessage('Markdown文件解析失败，请确保文件格式正确', 'error');
            console.error('解析错误:', error);
        }
    };
    
    reader.onerror = function() {
        showStatusMessage('文件读取失败', 'error');
    };
    
    reader.readAsText(file);
}

// 解析Markdown内容
function parseMarkdownContent(content) {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const root = { name: '飞机系统', children: [] };
    
    // 检查是否使用标题格式
    if (lines.some(line => line.trim().startsWith('#'))) {
        // 使用标题格式解析
        parseHeadingFormat(lines, root);
    } else {
        // 使用列表格式解析
        parseListFormat(lines, root);
    }
    
    return { root: root };
}

// 解析标题格式
function parseHeadingFormat(lines, root) {
    const stack = [root];
    
    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('#')) {
            // 计算标题级别
            const level = trimmedLine.match(/^#+/)?.[0].length || 1;
            const name = trimmedLine.replace(/^#+\s*/, '');
            
            // 调整栈的深度
            while (stack.length > level) {
                stack.pop();
            }
            
            // 创建新节点
            const newNode = { name: name, children: [] };
            
            // 添加到当前父节点
            if (stack.length > 0) {
                stack[stack.length - 1].children.push(newNode);
            }
            
            // 将新节点推入栈
            stack.push(newNode);
        }
    });
}

// 解析列表格式
function parseListFormat(lines, root) {
    const stack = [root];
    
    lines.forEach(line => {
        // 计算缩进级别和列表标记
        const match = line.match(/^(\s*)([-*+]|\d+\.)\s+/);
        if (match) {
            const indent = match[1].length;
            const name = line.replace(/^\s*[-*+\d+\.]\s+/, '');
            
            // 计算缩进级别（假设4个空格为一级）
            const level = Math.floor(indent / 4) + 1;
            
            // 调整栈的深度
            while (stack.length > level) {
                stack.pop();
            }
            
            // 创建新节点
            const newNode = { name: name, children: [] };
            
            // 添加到当前父节点
            if (stack.length > 0) {
                stack[stack.length - 1].children.push(newNode);
            }
            
            // 将新节点推入栈
            stack.push(newNode);
        }
    });
}

// 解析.xmind格式文件
function parseXMindFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // 使用JSZip解压.xmind文件
            JSZip.loadAsync(e.target.result).then(function(zip) {
                // 查找content.xml文件，处理不同可能的路径
                let contentFile = zip.file('content.xml');
                if (!contentFile) {
                    // 尝试查找其他可能的路径
                    const zipEntries = Object.keys(zip.files);
                    contentFile = zip.file(zipEntries.find(entry => entry.includes('content.xml')));
                }
                
                if (contentFile) {
                    contentFile.async('string').then(function(content) {
                        try {
                            // 解析XML内容
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(content, 'application/xml');
                            
                            // 提取思维导图数据
                            const mindmapData = extractDataFromXMind(xmlDoc);
                            
                            // 转换思维导图数据为系统数据格式
                            const convertedData = convertMindmapToSystemData(mindmapData);
                            
                            // 保存到本地存储（当前设备上传的内容设为公共，其他设备可见）
                            const saved = saveMindmapToLocal(convertedData, true);
                            
                            // 更新系统数据
                            systemData = convertedData;
                            
                            // 重新渲染系统列表
                            renderSystemList();
                            
                            if (saved) {
                                showStatusMessage('思维导图解析成功并已保存！', 'success');
                            } else {
                                showStatusMessage('思维导图解析成功但保存失败', 'warning');
                            }
                        } catch (error) {
                            showStatusMessage('思维导图解析失败，请确保文件格式正确', 'error');
                            console.error('解析错误:', error);
                        }
                    }).catch(function(error) {
                        showStatusMessage('XMind文件内容读取失败', 'error');
                        console.error('读取错误:', error);
                    });
                } else {
                    showStatusMessage('XMind文件结构不正确，未找到content.xml', 'error');
                }
            }).catch(function(error) {
                showStatusMessage('XMind文件解压失败，请确保文件格式正确', 'error');
                console.error('解压错误:', error);
            });
        } catch (error) {
            showStatusMessage('文件读取失败', 'error');
            console.error('读取错误:', error);
        }
    };
    
    reader.onerror = function() {
        showStatusMessage('文件读取失败', 'error');
    };
    
    reader.readAsArrayBuffer(file);
}

// 从XMind XML中提取数据
function extractDataFromXMind(xmlDoc) {
    // 查找根主题
    const rootTopic = xmlDoc.querySelector('topic');
    if (!rootTopic) {
        return { root: { name: '飞机系统', children: [] } };
    }
    
    // 提取根主题名称
    const rootName = rootTopic.querySelector('title')?.textContent || '飞机系统';
    
    // 提取子主题
    const children = [];
    const subTopics = rootTopic.querySelectorAll('children > topic');
    subTopics.forEach((topic, index) => {
        children.push(extractTopicData(topic, index + 1));
    });
    
    return {
        root: {
            name: rootName,
            children: children
        }
    };
}

// 递归提取主题数据
function extractTopicData(topic, index) {
    const name = topic.querySelector('title')?.textContent || `主题${index}`;
    const children = [];
    
    const subTopics = topic.querySelectorAll('children > topic');
    subTopics.forEach((subTopic, subIndex) => {
        children.push(extractTopicData(subTopic, subIndex + 1));
    });
    
    return {
        name: name,
        children: children
    };
}

// 转换思维导图数据为系统数据格式
function convertMindmapToSystemData(mindmapData) {
    // 这里实现思维导图数据转换逻辑
    // 由于不同思维导图工具的格式可能不同，这里提供一个简单的转换示例
    // 实际应用中可能需要根据具体的思维导图格式进行调整
    
    // 示例：假设思维导图数据有以下结构
    // {
    //   "root": {
    //     "name": "飞机系统",
    //     "children": [
    //       {
    //         "name": "动力系统",
    //         "children": [...] 
    //       }
    //     ]
    //   }
    // }
    
    if (mindmapData.root && mindmapData.root.children) {
        const newSystemData = mindmapData.root.children.map((child, index) => {
            return {
                id: (index + 1).toString(),
                name: child.name,
                description: child.description || '',
                children: convertChildren(child.children, (index + 1).toString())
            };
        });
        
        // 实现文件覆盖功能：如果上传的系统名称与现有系统名称相同，则更新对应系统
        const updatedSystemData = [];
        const existingSystemNames = new Set(systemData.map(system => system.name));
        
        // 添加新系统或更新现有系统
        newSystemData.forEach(newSystem => {
            if (existingSystemNames.has(newSystem.name)) {
                // 更新现有系统
                const existingSystemIndex = systemData.findIndex(system => system.name === newSystem.name);
                if (existingSystemIndex !== -1) {
                    updatedSystemData.push(newSystem);
                }
            } else {
                // 添加新系统
                updatedSystemData.push(newSystem);
            }
        });
        
        // 保留未被更新的现有系统
        systemData.forEach(existingSystem => {
            if (!newSystemData.some(newSystem => newSystem.name === existingSystem.name)) {
                updatedSystemData.push(existingSystem);
            }
        });
        
        return updatedSystemData;
    }
    
    // 如果格式不匹配，返回空数组
    return [];
}

// 递归转换子节点
function convertChildren(children, parentId) {
    if (!children || !Array.isArray(children)) {
        return [];
    }
    
    return children.map((child, index) => {
        const currentId = `${parentId}-${index + 1}`;
        return {
            id: currentId,
            name: child.name,
            description: child.description || '',
            children: convertChildren(child.children, currentId)
        };
    });
}

// 启动应用
window.addEventListener('DOMContentLoaded', initApp);