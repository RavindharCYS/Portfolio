document.addEventListener("DOMContentLoaded", function() {
    // Existing code for typing effect on home page
    const text = "\"I am Ravindhar V, a cybersecurity professional with a Bachelor's Degree in Cyber Security and currently pursuing the Cyber Security Specialist program at NIIT Chennai. My expertise includes Linux Administration, web design, and programming in Python, C++, C, and Java. I've completed training in Robotic Process Automation (RPA) and have experience with IoT projects, including the Eco-Inverter. Notable projects include a Password Manager and Sentinel-Site, which enhance security and forensic capabilities. I aim to specialize as a Penetration Tester and am committed to continuous learning and collaboration in the cybersecurity field.\" ";

    const aboutDescription = document.querySelector('.about-description');
    if (aboutDescription) {
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        aboutDescription.appendChild(cursor);

        let charIndex = 0;

        function typeText() {
            if (charIndex < text.length) {
                aboutDescription.insertBefore(document.createTextNode(text[charIndex]), cursor);
                charIndex++;
                setTimeout(typeText, 25); // Adjust typing speed here
            }
        }

        setTimeout(typeText, 1000); // Start typing after 1 second
    }

    // Existing code for smooth scrolling on resume page
    function smoothScroll(target, duration) {
        var target = document.querySelector(target);
        var targetPosition = target.getBoundingClientRect().top;
        var startPosition = window.pageYOffset;
        var distance = targetPosition - startPosition;
        var startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            var timeElapsed = currentTime - startTime;
            var run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Add smooth scroll to all links in the resume page
    if (document.body.classList.contains('resume-page')) {
        var links = document.querySelectorAll('a[href^="#"]');
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var target = this.getAttribute('href');
                smoothScroll(target, 1000);
            });
        });
    }

    // Existing code for contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send this data to a server
            // For now, we'll just log it to the console
            console.log('Form submitted:');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Message:', message);
            
            // Clear the form
            contactForm.reset();
            
            // Show a success message (you can replace this with a more sophisticated notification)
            alert('Thank you for your message! I will get back to you soon.');
        });
    }

    // New code for courses.html with the required formatting changes
    const courseData = {
        1: { title: "Cybersecurity Specialist", description: "The Cyber Security Specialist Program is a comprehensive course designed to equip students with a diverse skill set essential for today/'s digital security landscape. This intensive program covers a wide range of topics, starting with Linux system administration essentials, where students master command-line interfaces, user management, and system hardening techniques. The course then delves into Python programming and scripting, focusing on creating secure, efficient code and managing databases. Network security is a key component, teaching students to design, implement, and troubleshoot both logical and physical networks using tools like Cisco Packet Tracer and Wireshark. Advanced topics include cloud computing and containerization with Docker and Kubernetes, as well as in-depth study of information security systems and cryptography. The program culminates with hands-on ethical hacking and system exploitation modules, where students learn to identify vulnerabilities, conduct penetration tests, and implement robust security measures. Throughout the course, cutting-edge GenAI tools are integrated for task automation and advanced analysis, preparing students for the future of cybersecurity. By the end of this program, participants will have gained practical, industry-relevant skills, ready to tackle complex security challenges in various IT environments.", image: "course1.jpg" },
        2: { title: "Red Hat Linux Administration", description: "The Red Hat Linux Administration Essentials course, offered by Advantage Pro, provides a robust foundation in managing Red Hat Enterprise Linux environments. This hands-on program covers essential system administration tasks, starting with installation and configuration of Red Hat Enterprise Linux. Students learn to manage users and groups, configure file permissions, and handle storage using tools like LVM (Logical Volume Manager). The course delves into network configuration, teaching participants to set up and troubleshoot network interfaces and implement network security measures. System services management using systemd is a key focus, ensuring students can effectively control and monitor system processes. The program also covers package management with YUM/DNF, allowing administrators to efficiently install, update, and manage software. Throughout the course, there's an emphasis on security best practices, including SELinux configuration and firewall management. By the end of the program, participants will have the skills to perform day-to-day administration tasks, troubleshoot common issues, and maintain the security and performance of Red Hat Linux systems in enterprise environments.", image: "course2.jpg" },
        3: { title: "Robotic Process Automation", description: "This Robotic Process Automation (RPA) course, provided by UiPath, offers a comprehensive introduction to the world of business process automation. Students learn to design, develop, and deploy software robots that can mimic human actions, automating repetitive tasks and improving efficiency in various business processes. The course covers UiPath's Studio environment, teaching participants how to create automation workflows using a visual, drag-and-drop interface. Key topics include data manipulation, decision making in automations, and integration with various applications and systems. Students also learn about attended and unattended automation, understanding when and how to apply each type. The course emphasizes best practices in RPA development, including error handling, logging, and creating scalable, maintainable automations. By the end of the program, participants will be equipped with the skills to identify automation opportunities in their organizations and implement RPA solutions that drive productivity and reduce errors in business processes.", image: "course3.jpg" },
        4: { title: "Web Design", description: "This comprehensive Web Design course, offered online by Asia University, Taiwan, provides students with a solid foundation in creating modern, responsive websites. The program covers essential web technologies including HTML5, CSS3, and JavaScript, enabling students to build interactive and visually appealing web pages. Participants learn the principles of user experience (UX) and user interface (UI) design, ensuring they can create intuitive and user-friendly websites. The course also introduces popular frameworks and libraries such as Bootstrap and jQuery, allowing students to streamline their development process. Throughout the program, there's a strong emphasis on responsive design techniques, preparing students to create websites that work seamlessly across various devices and screen sizes. By the end of the course, students will have developed a portfolio of web projects, demonstrating their ability to design and implement professional-quality websites.", image: "course4.jpg" }
    };

    function createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2 style="font-family: 'Times New Roman', Times, serif;">${content.title}</h2>
                <img src="${content.image}" alt="${content.title}" style="max-width: 100%; height: auto;">
                <p style="font-family: 'Times New Roman', Times, serif; line-height: 1.5;">
                    ${content.description}
                </p>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close').onclick = function() {
            modal.style.display = "none";
        };
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

        return modal;
    }

    const items = document.querySelectorAll('.course-item, .certificate-item');
    items.forEach(item => {
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const content = courseData[id];
            const modal = createModal(content);
            modal.style.display = "block";
        });
    });
});
