const app = document.getElementById('app');
        let lives = 3;
        let stage = 1;
        let maxStage = 3;
        let timer;
        let totalTime = 600;
        let score = 0;
        let correctCards = 0;

        const decks = {
            1: ['Kucing', 'Anjing', 'Rubah', 'Katak', 'Kupu-kupu'],
            2: ['Apel', 'Pisang', 'Anggur', 'Jeruk', 'Stroberi', 'Kiwi', 'Persik', 'Mangga', 'Ceri'],
            3: ['Mobil', 'Taksi', 'SUV', 'Bus', 'Trem', 'Mobil Balap', 'Polisi', 'Ambulans', 'Pemadam', 'Van', 'Pickup', 'Truk', 'Trailer', 'Traktor', 'Skuter']
        };

        const icons = {
            // Stage 1 
            'Kucing': '🐱',
            'Anjing': '🐶',
            'Rubah': '🦊',
            'Katak': '🐸',
            'Kupu-kupu': '🦋',
            
            // Stage 2 
            'Apel': '🍎',
            'Pisang': '🍌',
            'Anggur': '🍇',
            'Jeruk': '🍊',
            'Stroberi': '🍓',
            'Kiwi': '🥝',
            'Persik': '🍑',
            'Mangga': '🥭',
            'Ceri': '🍒',
            
            // Stage 3
            'Mobil': '🚗',
            'Taksi': '🚕',
            'SUV': '🚙',
            'Bus': '🚌',
            'Trem': '🚊',
            'Mobil Balap': '🏎️',
            'Polisi': '🚓',
            'Ambulans': '🚑',
            'Pemadam': '🚒',
            'Van': '🚐',
            'Pickup': '🛻',
            'Truk': '🚚',
            'Trailer': '🚛',
            'Traktor': '🚜',
            'Skuter': '🛵'
        };

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        function startCountdown() {
            return new Promise(async (resolve) => {
                app.innerHTML = `<div class='text-center fade-in'><h2 class='text-3xl mb-4'>Apakah kamu sudah siap?</h2></div>`;
                await delay(1500);
                for (let i = 3; i >= 1; i--) {
                    app.innerHTML = `<div class='text-center fade-in'><h2 class='text-6xl font-bold'>${i}</h2></div>`;
                    await delay(1000);
                }
                resolve();
            });
        }

        function startTimer() {
            const interval = setInterval(() => {
                totalTime--;
                updateTimeDisplay();
                if (totalTime <= 0) {
                    clearInterval(interval);
                    alert(`Waktu habis! Game over.\nSkor Akhir: ${score}`);
                    showFinalScore();
                }
            }, 1000);
            return interval;
        }

        function shuffle(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        function renderGameStage() {
            const correctOrder = decks[stage];
            const shuffledCards = shuffle(correctOrder);
            let currentStep = 0;
            
            app.innerHTML = `
                <div class='fade-in'>
                    <!-- Header dengan layout baru -->
                    <div class="flex justify-between items-center mb-8">
                        <!-- Nyawa di kiri -->
                        <div class="flex items-center space-x-2">
                            <span class="text-lg font-semibold">Nyawa:</span>
                            <div id="lifeIcons" class="flex space-x-1">
                                ${Array(lives).fill('❤️').join('')}
                            </div>
                        </div>
                        
                        <!-- Stage di tengah -->
                        <div class="text-center">
                            <div class="text-2xl font-bold">Stage ${stage}</div>
                        </div>
                        
                        <!-- Waktu di kanan -->
                        <div class="flex items-center space-x-2">
                            <span class="text-lg font-semibold">⏰</span>
                            <span id="timeLeft" class="text-lg font-mono">${formatTime(totalTime)}</span>
                        </div>
                    </div>
                    

                    
                    <!-- Grid kartu -->
                    <div id="cards" class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-center'>
                        ${shuffledCards.map((card) => `
                            <div class="memory-card bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center" data-card="${card}">
                                <div class="card-icon">${icons[card] || '❓'}</div>
                                <div class="text-lg font-semibold text-gray-800">${card}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;

            document.querySelectorAll('.memory-card').forEach(cardEl => {
                cardEl.addEventListener('click', () => {
                    const clicked = cardEl.getAttribute('data-card');
                    if (clicked === correctOrder[currentStep]) {
                        cardEl.classList.add('bg-green-300');
                        cardEl.classList.remove('cursor-pointer', 'hover:shadow-xl');
                        cardEl.style.transform = 'none';
                        currentStep++;
                        correctCards++;
                        updateScoreDisplay();
                        if (currentStep === correctOrder.length) {
                            // Bonus untuk menyelesaikan stage
                            score += stage * 50; 
                            if (stage < maxStage) {
                                stage++;
                                lives = 3;
                                setTimeout(() => {
                                    alert(`Lanjut ke stage berikutnya!\nBonus Stage ${stage-1}: ${(stage-1) * 50} poin`);
                                    renderGameStage();
                                }, 500);
                            } else {
                                // Bonus untuk menyelesaikan semua stage
                                score += 200;
                                setTimeout(() => {
                                    alert(`Selamat! Kamu telah menyelesaikan semua stage!\nBonus Penyelesaian: 200 poin\nSkor Akhir: ${score}`);
                                    showFinalScore();
                                }, 500);
                            }
                        }
                    } else {
                        lives--;
                        updateLifeDisplay();
                        cardEl.classList.add('bg-red-300');
                        cardEl.classList.remove('cursor-pointer', 'hover:shadow-xl');
                        cardEl.style.transform = 'none';
                        if (lives === 0) {
                            setTimeout(() => {
                                alert(`Game Over. Kamu kehabisan nyawa.\nSkor Akhir: ${score}`);
                                showFinalScore();
                            }, 500);
                        }
                    }
                });
            });
        }

        function updateScoreDisplay() {
        }

        function showFinalScore() {
            app.innerHTML = `
                <div class='text-center space-y-6 fade-in'>
                    <h1 class="text-4xl font-bold mb-6">Game Selesai!</h1>
                    <div class="bg-white bg-opacity-20 rounded-xl p-8 mx-auto max-w-md">
                        <h2 class="text-2xl font-bold mb-4">Hasil Akhir</h2>
                        <div class="space-y-3 text-lg">
                            <div>Skor Total: <span class="font-bold text-yellow-300">${score}</span></div>
                            <div>Kartu Benar: <span class="font-bold text-green-300">${correctCards}</span></div>
                            <div>Stage Tercapai: <span class="font-bold text-blue-300">${stage}/${maxStage}</span></div>
                        </div>
                    </div>
                    <a href="/index.html" class="inline-block bg-white text-purple-600 px-8 py-4 rounded text-xl font-semibold hover:bg-purple-100 transition-colors duration-300 shadow-lg">
                        Kembali
                    </a>
                </div>`;
        }

        function updateLifeDisplay() {
            const lifeIcons = document.getElementById('lifeIcons');
            if (lifeIcons) {
                lifeIcons.innerHTML = Array(lives).fill('❤️').join('') + Array(3 - lives).fill('🖤').join('');
            }
        }

        function updateTimeDisplay() {
            const timeLeft = document.getElementById("timeLeft");
            if (timeLeft) {
                timeLeft.textContent = formatTime(totalTime);
            }
        }

        function formatTime(seconds) {
            const min = Math.floor(seconds / 60).toString().padStart(2, '0');
            const sec = (seconds % 60).toString().padStart(2, '0');
            return `${min}:${sec}`;
        }

        document.addEventListener("DOMContentLoaded", () => {
            document.getElementById("playBtn").addEventListener("click", async () => {
                await startCountdown();
                timer = startTimer();
                renderGameStage();
            });
        });