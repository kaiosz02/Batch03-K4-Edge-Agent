flowchart LR
    %% Định nghĩa Style
    classDef student fill:#d4edda,stroke:#28a745,stroke-width:2px;
    classDef ai fill:#cce5ff,stroke:#007bff,stroke-width:2px;
    classDef instructor fill:#f8d7da,stroke:#dc3545,stroke-width:2px;
    classDef gamify fill:#fff3cd,stroke:#ffc107,stroke-width:2px;
    classDef pet fill:#fdfd96,stroke:#ffb347,stroke-width:2px;

    %% Các khối chính
    Student("Sinh viên<br/>Đọc & Bôi đen Slide"):::student
    Pet("Thú cưng (Pet)<br/>Hỏi: 'Làm Quiz nhận EXP không?'"):::pet
    AI{"Gemini AI<br/>Phân tích & Sinh Quiz"}:::ai
    Gamification("Gamification<br/>Tính EXP & Lên cấp"):::gamify
    Instructor("Giảng viên<br/>Xem Heatmap Vùng Khó"):::instructor

    %% Luồng Sinh viên
    Student -->|"Bôi đen đoạn khó"| Pet
    Pet -->|"Sinh viên Đồng ý"| AI
    AI -->|"Trả về Quiz thích ứng"| Student
    Student -->|"Trả lời Đúng/Sai"| Gamification
    
    %% Luồng Giảng viên (ngầm)
    Student -.->|"Log lại vị trí bôi đen"| Instructor
    Gamification -.->|"Log lại kết quả"| Instructor
