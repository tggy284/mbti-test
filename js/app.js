// MBTI测试核心逻辑
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// 用户认证系统
function registerUser(username, email, password) {
    const users = JSON.parse(localStorage.getItem('mbti_users')) || [];

    if (users.find(u => u.username === username)) {
        return { success: false, message: '用户名已存在' };
    }

    const newUser = {
        username,
        email,
        password: btoa(password),
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('mbti_users', JSON.stringify(users));

    currentUser = { username, email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    return { success: true, message: '注册成功' };
}

function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem('mbti_users')) || [];
    const user = users.find(u => u.username === username && u.password === btoa(password));

    if (!user) {
        return { success: false, message: '用户名或密码错误' };
    }

    currentUser = { username: user.username, email: user.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    return { success: true, message: '登录成功' };
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// 测试结果保存
function saveTestResult(username, result) {
    const allResults = JSON.parse(localStorage.getItem('mbti_results')) || {};
    if (!allResults[username]) {
        allResults[username] = [];
    }
    allResults[username].push({
        ...result,
        date: new Date().toISOString()
    });
    localStorage.setItem('mbti_results', JSON.stringify(allResults));
}

function getTestResults(username) {
    const allResults = JSON.parse(localStorage.getItem('mbti_results')) || {};
    return allResults[username] || [];
}

// MBTI计算算法
function calculateMBTI(questions, answers) {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    questions.forEach((q, index) => {
        const answer = answers[index];
        if (answer === 0) {
            scores[q.aType]++;
        } else if (answer === 1) {
            scores[q.bType]++;
        }
    });

    // 确定类型
    let type = '';
    type += scores.E > scores.I ? 'E' : 'I';
    type += scores.S > scores.N ? 'S' : 'N';
    type += scores.T > scores.F ? 'T' : 'F';
    type += scores.J > scores.P ? 'J' : 'P';

    // 同分处理规则
    if (scores.E === scores.I) type += 'I';
    if (scores.S === scores.N) type += 'N';
    if (scores.T === scores.F) type += 'F';
    if (scores.J === scores.P) type += 'P';

    return {
        type,
        scores: {
            E: scores.E,
            I: scores.I,
            S: scores.S,
            N: scores.N,
            T: scores.T,
            F: scores.F,
            J: scores.J,
            P: scores.P
        }
    };
}

// 更新导航栏用户状态
function updateUserNav() {
    const nav = document.getElementById('userNav');
    if (!nav) return;

    if (currentUser) {
        nav.innerHTML = `
            <span class="text-gray-600 font-medium">欢迎，${currentUser.username}</span>
            <button onclick="logoutUser()" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">
                退出登录
            </button>
        `;
    } else {
        nav.innerHTML = `
            <a href="login.html" class="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
                登录 / 注册
            </a>
        `;
    }
}

// 页面加载时更新导航
document.addEventListener('DOMContentLoaded', function() {
    updateUserNav();
});
