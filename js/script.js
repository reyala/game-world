const gamesDatabase = {
    "RPG": ["Cyberpunk 2077", "Baldur's Gate 3", "The Witcher 3", "Elden Ring", "Skyrim"],
    "Шутер": ["Counter-Strike 2", "Half-Life 2", "DOOM Eternal", "Metro Exodus", "S.T.A.L.K.E.R. 2"],
    "Стратегия": ["Civilization VI", "Heroes III", "Starcraft II", "Dota 2"],
    "Экшен": ["GTA V", "Red Dead Redemption 2", "God of War Ragnarok"],
    "Выживание": ["Minecraft", "Terraria", "Rust", "Valheim", "Subnautica"]
};

function getRandomGame() {
    const genreSelect = document.getElementById('genreSelect');
    const resultElem = document.getElementById('recommendResult');
    
    if (genreSelect && resultElem) {
        const selectedGenre = genreSelect.value;
        const list = gamesDatabase[selectedGenre];
        if (list && list.length > 0) {
            const randomIndex = Math.floor(Math.random() * list.length);
            resultElem.textContent = "Рекомендуемая игра: " + list[randomIndex];
        }
    }
}

// Хранилище для работы с массивами
let userRatings = [];

function addGameRating() {
    const titleInput = document.getElementById('gameTitle');
    const hoursInput = document.getElementById('gameHours');
    const scoreInput = document.getElementById('gameScore');

    const title = titleInput.value.trim();
    const hours = parseFloat(hoursInput.value);
    const score = parseFloat(scoreInput.value);

    // Проверка заполненности
    if (title === "" || isNaN(hours) || isNaN(score)) {
        alert("Пожалуйста, заполните все поля корректно!");
        return;
    }

    // Проверка диапазона оценки от 1 до 10
    if (score < 1 || score > 10) {
        alert("Оценка должна быть в диапазоне от 1 до 10!");
        return;
    }

    userRatings.push({
        title: title,
        hours: hours,
        score: score
    });

    titleInput.value = "";
    hoursInput.value = "";
    scoreInput.value = "";

    updateRatingsUI();
}

// Функция удаления элемента из массива по его индексу
function deleteRating(index) {
    userRatings.splice(index, 1);
    updateRatingsUI();
}

function updateRatingsUI() {
    const listElem = document.getElementById('ratingsList');
    const totalCountElem = document.getElementById('totalCount');
    const totalHoursElem = document.getElementById('totalHours');
    const avgScoreElem = document.getElementById('avgScore');

    if (!listElem) return;

    listElem.innerHTML = "";
    let sumHours = 0;
    let sumScore = 0;

    userRatings.forEach((item, index) => {
        sumHours += item.hours;
        sumScore += item.score;

        const li = document.createElement('li');
        li.style.marginBottom = "8px";
        
        // Текст записи + кнопка удаления
        li.innerHTML = `Игра: "${item.title}" — сыграно: ${item.hours} ч. | Оценка: ${item.score}/10 ` +
                       `<button type="button" onclick="deleteRating(${index})" style="background-color: #d32f2f; padding: 2px 8px; font-size: 12px; margin-left: 10px;">Удалить</button>`;
        
        listElem.appendChild(li);
    });

    const count = userRatings.length;
    const avgScore = count > 0 ? (sumScore / count).toFixed(2) : 0;

    totalCountElem.textContent = count;
    totalHoursElem.textContent = sumHours;
    avgScoreElem.textContent = avgScore;
}

// Массив для хранения студентов и результатов их экзаменов.
let students = [];

// Объект Math используется для округления среднего балла до двух знаков.
function roundStudentAverage(value) {
    return Math.round(value * 100) / 100;
}

function addStudent() {
    const nameInput = document.getElementById('studentName');
    const scoreInputs = [
        document.getElementById('exam1'),
        document.getElementById('exam2'),
        document.getElementById('exam3')
    ];

    // Объект String преобразует введённое имя в строку, trim() убирает лишние пробелы.
    const name = String(nameInput.value).trim();

    if (name === '') {
        alert('Пожалуйста, введите имя студента.');
        nameInput.focus();
        return;
    }

    if (scoreInputs.some(input => input.value.trim() === '' || isNaN(parseFloat(input.value)))) {
        alert('Пожалуйста, заполните баллы за все три экзамена.');
        return;
    }

    const scores = scoreInputs.map(input => parseFloat(input.value));
    if (scores.some(score => score < 0 || score > 100)) {
        alert('Баллы за каждый экзамен должны быть от 0 до 100.');
        return;
    }

    students.push({
        name: name,
        scores: scores
    });

    nameInput.value = '';
    scoreInputs.forEach(input => input.value = '');
    updateStudentsUI();
}

function deleteStudent(index) {
    students.splice(index, 1);
    updateStudentsUI();
}

function updateStudentsUI() {
    const tableBody = document.getElementById('studentsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const examSums = [0, 0, 0];

    students.forEach((student, index) => {
        student.scores.forEach((score, examIndex) => {
            examSums[examIndex] += score;
        });

        const total = student.scores.reduce((sum, score) => sum + score, 0);
        const average = roundStudentAverage(total / student.scores.length);
        const row = document.createElement('tr');
        const values = [
            index + 1,
            student.name,
            student.scores[0],
            student.scores[1],
            student.scores[2],
            total,
            average.toFixed(2)
        ];

        values.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Удалить';
        deleteButton.onclick = () => deleteStudent(index);
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });

    const count = students.length;
    const allPoints = examSums.reduce((sum, value) => sum + value, 0);
    const examAverages = examSums.map(sum => count > 0 ? roundStudentAverage(sum / count) : 0);

    document.getElementById('studentCount').textContent = count;
    document.getElementById('allExamPoints').textContent = allPoints;
    document.getElementById('averageExam1').textContent = examAverages[0].toFixed(2);
    document.getElementById('averageExam2').textContent = examAverages[1].toFixed(2);
    document.getElementById('averageExam3').textContent = examAverages[2].toFixed(2);
}

