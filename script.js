
document.addEventListener('DOMContentLoaded', () => {

    // Adding subtle 3D tilt effect on the card (Apple TV like)
    const card = document.getElementById('main-card');
    const container = document.querySelector('.card-container');

    if (card && container) {
        container.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate center of the card
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate distance from center (normalized from -1 to 1)
            const mouseX = (e.clientX - centerX) / (rect.width / 2);
            const mouseY = (e.clientY - centerY) / (rect.height / 2);

            // subtle rotation (max 6 degrees)
            const rotateX = mouseY * -6;
            const rotateY = mouseX * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0) scale(1)`;
        });

        container.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
            card.style.transition = `transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)`;
        });

        container.addEventListener('mouseenter', () => {
            card.style.transition = `transform 0.1s ease`;
        });
    }

    // Modal Interactions & Progressive Scan
    const revealBtn = document.getElementById('reveal-btn');
    const closeBtn = document.getElementById('close-btn');
    const overlay = document.getElementById('surprise-overlay');
    const bgAudio = document.getElementById('bg-audio');

    // Core Elements for the loading phase
    const loadingPhase = document.getElementById('loading-phase');
    const resultPhase = document.getElementById('result-phase');
    const progressBar = document.getElementById('progress-bar');
    const loadingText = document.getElementById('loading-text');
    const overlayTitle = document.getElementById('overlay-title');

    const loaderMessages = [
        "Extracting genetic material...",
        "Sequencing awesomeness DNA...",
        "Analyzing teaching methodologies...",
        "Calculating impact factor...",
        "Finalizing results..."
    ];

    if (revealBtn && overlay && closeBtn) {
        revealBtn.addEventListener('click', () => {
            // Unmute and play audio
            if (bgAudio) {
                bgAudio.volume = 0.5;
                bgAudio.play().catch(e => console.log('Audio autoplay prevented by standard browser policy. It should play after interaction.', e));
            }

            // Reset UI State
            overlay.classList.add('active');
            loadingPhase.style.display = 'block';
            resultPhase.style.display = 'none';
            progressBar.style.width = '0%';
            overlayTitle.innerText = "Initiating Analysis";
            loadingText.innerText = loaderMessages[0];

            let progress = 0;
            let messageIndex = 1;

            // Start the scanning sequence
            const scanInterval = setInterval(() => {
                progress += 1;
                progressBar.style.width = progress + '%';

                // Update messages as progress hits certain milestones
                if (progress % 20 === 0 && messageIndex < loaderMessages.length) {
                    loadingText.innerText = loaderMessages[messageIndex];
                    messageIndex++;
                }

                if (progress >= 100) {
                    clearInterval(scanInterval);

                    // Transition to results screen
                    setTimeout(() => {
                        loadingPhase.style.display = 'none';
                        resultPhase.style.display = 'block';
                        overlayTitle.innerText = "Analysis Complete";

                        // Fire Confetti!
                        if (window.confetti) {
                            var duration = 3500;
                            var end = Date.now() + duration;

                            (function frame() {
                                confetti({
                                    particleCount: 5,
                                    angle: 60,
                                    spread: 55,
                                    origin: { x: 0 },
                                    colors: ['#32d74b', '#0a84ff', '#ffffff'] // Matching Apple palette
                                });
                                confetti({
                                    particleCount: 5,
                                    angle: 120,
                                    spread: 55,
                                    origin: { x: 1 },
                                    colors: ['#32d74b', '#0a84ff', '#ffffff']
                                });

                                if (Date.now() < end) {
                                    requestAnimationFrame(frame);
                                }
                            }());
                        }

                        // Animate data cards stagger in
                        const cards = document.querySelectorAll('.data-card');
                        cards.forEach((c, index) => {
                            c.style.opacity = '0';
                            c.style.transform = 'translateY(10px)';
                            setTimeout(() => {
                                c.style.transition = 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
                                c.style.opacity = '1';
                                c.style.transform = 'translateY(0)';
                            }, 100 + (index * 150));
                        });
                    }, 500);
                }
            }, 60); // 60ms * 100 steps = 6 seconds of scanning awesomeness
        });

        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            if (bgAudio) {
                // Fade out audio gracefully
                let fadeAudio = setInterval(() => {
                    if (bgAudio.volume > 0.05) {
                        bgAudio.volume -= 0.05;
                    } else {
                        bgAudio.pause();
                        bgAudio.currentTime = 0;
                        clearInterval(fadeAudio);
                    }
                }, 100);
            }
        });
    }

});

