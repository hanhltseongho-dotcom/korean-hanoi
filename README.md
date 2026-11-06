# KOREAN HANOI v0.3 — Thế giới 3D

## Thay đổi lớn
- **WebGL 3D thật**: camera phối cảnh, khối nhà có chiều sâu, ánh sáng hướng, chiều sâu z-buffer. Không cần tải thư viện từ mạng.
- **Camera**: kéo chuột xoay góc nhìn; cuộn chuột để zoom; nút đặt lại camera.
- **Ngày/đêm**: thay đổi ánh sáng và nền trời.
- **NPC trên bản đồ 3D**: 6 nhân vật hội thoại, có thể tiếp cận hoặc chọn NPC rồi dịch chuyển đến.
- **Giữ hệ thống v0.2**: sáu chương hội thoại 18 lượt, 12 flashcard, 9 nhiệm vụ địa điểm, cửa hàng, ba lô, cấp độ, quiz, bản đồ mini và xuất/nhập JSON.
- **Canvas 2D dự phòng**: bấm nút chuyển chế độ để so sánh với phiên bản cũ.

## Chạy game
Giải nén toàn bộ ZIP, mở `index.html` trong Chrome. Không di chuyển riêng file HTML ra khỏi thư mục. Game chạy offline.

## Nhập tiến độ từ v0.2
Trong game tìm **Sao lưu và chuyển dữ liệu → Nhập dữ liệu**, chọn file `korean-hanoi-save-v02.json` đã lưu trước đó. Trước khi nhập, xuất bản sao lưu nếu bạn có tiến độ mới. Nhập sẽ ghi đè tiến độ hiện tại và tải lại game. Bản v0.3 dùng cùng cấu trúc dữ liệu với v0.2.

## Cần kiểm tra
1. Thế giới 3D hiển thị, nhân vật đi bằng WASD, Shift chạy.
2. Kéo chuột để xoay camera; cuộn để zoom; đổi ngày/đêm.
3. Chọn NPC và bấm Đến gặp NPC; hội thoại 3 lượt hoạt động.
4. Nhập JSON cũ, kiểm tra tên nhân vật, XP, xu, vật phẩm, nhiệm vụ.
5. Xuất JSON mới sau khi kiểm tra.

## Giới hạn hiện tại
Đây là **3D WebGL thật**, nhưng mô hình còn low-poly dạng khối, chưa có nhân vật rigged/animation, âm thanh, va chạm, AI NPC hoặc bản đồ địa lý chính xác. Điều khiển cảm ứng trên điện thoại cần được cải thiện trong các bản sau. 3D dùng WebGL của Chrome; nếu trình duyệt không hỗ trợ, dùng Canvas 2D.

## Mã nguồn
- `index.html` — giao diện
- `style.css` — giao diện và bố cục
- `js/game.js` — hệ thống nhiệm vụ, hội thoại, lưu tiến độ v0.2
- `js/world3d.js` — bộ dựng 3D WebGL và tương tác NPC mới
