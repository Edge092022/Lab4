// Dữ liệu tĩnh cho danh bạ. id là string vì useParams() luôn trả về string.
// PERSON_FIELDS là contract hiển thị dùng chung cho PersonDetail và Skeleton
// (đặt ở đây, KHÔNG đặt trong PersonDetail, để Skeleton không kéo PersonDetail vào bundle chính).
export const PERSON_FIELDS = [
  { key: 'name', label: 'Họ tên' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Vai trò' },
  { key: 'city', label: 'Thành phố' },
];

export const people = [
  { id: '1', name: 'Nguyễn Văn An', email: 'an.nguyen@example.com', role: 'Frontend Developer', city: 'TP. Hồ Chí Minh' },
  { id: '2', name: 'Trần Thị Bình', email: 'binh.tran@example.com', role: 'Backend Developer', city: 'Hà Nội' },
  { id: '3', name: 'Lê Hoàng Cường', email: 'cuong.le@example.com', role: 'UI/UX Designer', city: 'Đà Nẵng' },
  { id: '4', name: 'Phạm Minh Dũng', email: 'dung.pham@example.com', role: 'QA Engineer', city: 'Cần Thơ' },
  { id: '5', name: 'Hoàng Thu Hà', email: 'ha.hoang@example.com', role: 'Product Manager', city: 'TP. Hồ Chí Minh' },
  { id: '6', name: 'Vũ Đức Khang', email: 'khang.vu@example.com', role: 'DevOps Engineer', city: 'Hải Phòng' },
  { id: '7', name: 'Đặng Ngọc Lan', email: 'lan.dang@example.com', role: 'Data Analyst', city: 'Huế' },
  { id: '8', name: 'Bùi Quang Minh', email: 'minh.bui@example.com', role: 'Mobile Developer', city: 'Nha Trang' },
  { id: '9', name: 'Đỗ Thanh Nga', email: 'nga.do@example.com', role: 'Tech Lead', city: 'Hà Nội' },
  { id: '10', name: 'Ngô Bảo Phúc', email: 'phuc.ngo@example.com', role: 'Security Engineer', city: 'Vũng Tàu' },
];
