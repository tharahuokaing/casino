<script>
        // Roulette spin interface integration
        // Make Roulette spin method global so execute() can access
        const ROULETTE_NUMBERS = [
            { n: 0, c: 'green' }, { n: 32, c: 'red' }, { n: 15, c: 'black' }, { n: 19, c: 'red' }, { n: 4, c: 'black' },
            { n: 21, c: 'red' }, { n: 2, c: 'black' }, { n: 25, c: 'red' }, { n: 17, c: 'black' }, { n: 34, c: 'red' },
            { n: 6, c: 'black' }, { n: 27, c: 'red' }, { n: 13, c: 'black' }, { n: 36, c: 'red' }, { n: 11, c: 'black' },
            { n: 30, c: 'red' }, { n: 8, c: 'black' }, { n: 23, c: 'red' }, { n: 10, c: 'black' }, { n: 5, c: 'red' },
            { n: 24, c: 'black' }, { n: 16, c: 'red' }, { n: 33, c: 'black' }, { n: 1, c: 'red' }, { n: 20, c: 'black' },
            { n: 14, c: 'red' }, { n: 31, c: 'black' }, { n: 9, c: 'red' }, { n: 22, c: 'black' }, { n: 18, c: 'red' },
            { n: 29, c: 'black' }, { n: 7, c: 'red' }, { n: 28, c: 'black' }, { n: 12, c: 'red' }, { n: 35, c: 'black' },
            { n: 3, c: 'red' }, { n: 26, c: 'black' }
        ];

        let balance = 1000.0;

        function append(sender, text) {
            const chat = document.getElementById('chat');
            const message = document.createElement('div');
            message.style.margin = "8px 0";
            message.style.padding = "6px 12px";
            message.style.borderRadius = "8px";
            if (sender === 'user') {
                message.style.backgroundColor = "#d0eaff";
                message.style.alignSelf = "flex-end";
                message.innerHTML = `<b>You:</b> ${text}`;
            } else {
                message.style.backgroundColor = "#e0e0e0";
                message.innerHTML = `<b>Bot:</b> ${text}`;
            }
            chat.appendChild(message);
            chat.scrollTop = chat.scrollHeight;
        }

        function spinRoulette(betAmount, betType, betValue) {
            betAmount = Number(betAmount);
            if (isNaN(betAmount) || betAmount <= 0) {
                return "❌ សូមបញ្ចូលចំនួនលុយដែលត្រឹមត្រូវសម្រាប់ការភ្នាល់។";
            }
            if (betAmount > balance) {
                return "❌ សមតុល្យមិនគ្រប់គ្រាន់ដើម្បីភ្នាល់ទេ!";
            }

            const result = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];

            let win = false;
            let payoutMultiplier = 0;

            if (betType === 'number') {
                if (parseInt(betValue) === result.n) {
                    win = true;
                    payoutMultiplier = 35;
                }
            } else if (betType === 'color') {
                if (betValue.toLowerCase() === result.c) {
                    win = true;
                    payoutMultiplier = 1;
                }
            } else if (betType === 'parity') {
                if (result.n !== 0) {
                    const isEven = result.n % 2 === 0;
                    if ((betValue === 'even' && isEven) || (betValue === 'odd' && !isEven)) {
                        win = true;
                        payoutMultiplier = 1;
                    }
                }
            } else {
                return "❌ ប្រភេទបាក់ប៉ុន្មានមិនត្រឹមត្រូវ (number, color, parity ត្រូវបានគាំទ្រ)។";
            }

            if (win) {
                const winnings = betAmount * payoutMultiplier;
                balance += winnings;
                return `🎉 គ្រាប់បាល់ឈប់នៅលេខ <span style="color:${result.c}"><b>${result.n} (${result.c.toUpperCase()})</b></span><br>✅ អបអរសាទរ! អ្នកបានឈ្នះ $${winnings.toFixed(2)}។ សមតុល្យបច្ចុប្បន្ន: $${balance.toFixed(2)}`;
            } else {
                balance -= betAmount;
                return `🎲 គ្រាប់បាល់ឈប់នៅលេខ <span style="color:${result.c}"><b>${result.n} (${result.c.toUpperCase()})</b></span><br>❌ សុំណាងមិនល្អ! អ្នកបាត់បង់ $${betAmount.toFixed(2)}។ សមតុល្យបច្ចុប្បន្ន: $${balance.toFixed(2)}`;
            }
        }

        async function askAI(question) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve("សូមសួរពីការភ្នាល់ ឬ ការលេងហ្គេមដោយបញ្ចូល 'រ៉ូឡែត' ឬ 'បាការ៉ាត់' ជាមួយការភ្នាល់របស់អ្នក។");
                }, 800);
            });
        }

        function speak(text) {
            if (!window.speechSynthesis) return;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'km-KH';
            window.speechSynthesis.speak(utterance);
        }

        async function execute() {
    const input = document.getElementById('userInput');
    const val = input.value.trim().toLowerCase();
    if (!val) return;
    append('user', val);
    input.value = '';

    let reply;

    if (val.includes("បាការ៉ាត់")) {
        // Expect format: "បាការ៉ាត់ 20 player"
        const parts = val.split(" ");
        const amount = parseInt(parts[1]) || 10;
        const side = parts[2] || 'player';
        reply = baccaratBet(amount, side);
    }
    else if (val.includes("រ៉ូឡែត")) {
        const parts = val.split(" ");
        const amount = parseInt(parts[1]) || 10;
        const type = parts[2];
        const target = parts[3];
        reply = spinRoulette(amount, type, target);
    }
    else {
        reply = await askAI(val);
    }

    append('bot', reply);
    speak(reply);
}
        showTime();
        setInterval(showTime, 1000);
    </script>