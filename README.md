                        ĐÂY LÀ PHẦN HƯỚNG DẪN HỆ THỐNG HOẠT ĐỘNG

- Đang dùng là version node 14.17.0
- Đầu tiên sau khi git clone cả 2 project nodejs và app-react từ github về thì chạy câu lệnh npm i

cần tải docker, dbeaver
Download Docker:
https://docs.docker.com/desktop/install/windows-install/

Chạy câu lệnh bên dưới bên trong thư mục docker:
docker compose -f mysql.yml -p nodejs-sql up -d

Download dbeaver:
https://dbeaver.io/download/

B3: Tạo connection trong DBeaver
Khi chạy ứng dụng lên nhấn vào connect to a database -> chọn mysql, nếu là chạy lần đầu với DBeaver -> nhấn nút dowload mysql
Sửa lại Port 3307, tên database là luonghuy, mật khẩu 123456 -> Sau đó nhấn nút test connection và Finish.
Xuất hiện database tên luonghuy -> nhấn vào nó -> databases -> luonghuy -> tiếp tục chuột phải vào nó
Chọn tools -> Restore database -> input file(chọn tệp script SQL có tên allDatabaseQLPK ở trong thư mục mysql ) -> start
Refresh lại database sẽ có xuất hiện các table.

1 số tài khoản hiện có

- tài khoản quản trị viên là admin
- mật khẩu là 123

  - tài khoản bác sĩ là ad1
  - mật khẩu là 123

  - tài khoản y tá là ad7
  - mật khẩu là 123

Sau này, mỗi lần cần sử dụng database MySQL, đảm bảo rằng 'đã chạy docker trước'.
Không cần 'update docker' để hạn chế mất dữ liệu
Kiểu tháng/ngày/năm được sử dụng trong hệ thống
Chạy project tên nodejs dùng lệnh npm run dev
Chạy project tên app-react dùng lệnh npm start

Email liên hệ hỗ trợ: 2051012035huy@ou.edu.vn
Số điện thoại: 0367304511
