export default {
  title: "Cấu hình đánh giá nhà cung cấp",
  create: "Tạo mới bộ tiêu chí đánh giá",
  update: "Cập nhật bộ tiêu chí đánh giá",
  preview: "Chi tiết bộ tiêu chí đánh giá",
  advanceFilter: "Tìm kiếm nâng cao",
  message_empty_data: "Hệ thống của bạn chưa ghi nhận dữ liệu nào. ",
  let_add_new: "Hãy thêm mới dữ liệu Bộ tiêu chí đánh giá",
  // Breadcrumbs
  breadcrumbs: {
    home: "Trang chủ",
    supplierEvaluationConfig: "Cấu hình đánh giá nhà cung cấp",
  },

  // Table title
  code: "Mã Bộ tiêu chí đánh giá",
  name: "Tên Bộ tiêu chí đánh giá",
  maximumScore: "Điểm tối đa",

  status: "Trạng thái",
  active: "Hoạt động",
  description: "Mô tả",
  inactive: "Ngừng hoạt động",
  deleteTitle: "Xác nhận xoá bộ tiêu chí đánh giá",
  bulkDeleteTitle1: "Xác nhận xoá",
  bulkDeleteTitle2: "bộ tiêu chí đánh giá",
  deleteContent:
    "Thao tác này không thể khôi phục. Bạn có chắc chắn muốn xóa bộ tiêu chí đánh giá được chọn",

  txt_stt: "STT",
  evaluationItem: "Tiêu chí đánh giá",
  emptyEvaluationItem: "Chưa có thông tin Tiêu chí đánh giá",
  addItem: "Thêm tiêu chí",
  evaluationResult: "Kết luận đánh giá",
  emptyDataResult: "Chưa có thông tin Kết luận đánh giá",
  addResult: "Thêm kết luận",
  totalWeight: "Tổng",

  evaluationItems: {
    code: "Mã tiêu chí",
    name: "Tên tiêu chí",
    weight: "Trọng số",
    standard: "Tiêu chuẩn",
  },
  evaluationResults: {
    fromScore: "Điểm từ",
    toScore: "Điểm đến",
    conclude: "Tiêu chuẩn",
  },
  detailItemModal: {
    create: "Tạo mới tiêu chí đánh giá",
    detail: "Chỉnh sửa tiêu chí đánh giá",
    code: "Mã tiêu chí",
    name: "Tên tiêu chí",
    weight: "Trọng số",
    standard: "Tiêu chuẩn",
    placeholderCode: "Nhập mã tiêu chí",
    placeholderWeight: "Nhập trọng số",
    placeholderName: "Nhập tên tiêu chí",
    placeholderStandard: "Nhập tiêu chuẩn",
  },
  detailResultModal: {
    create: "Tạo mới kết luận đánh giá",
    detail: "Chỉnh sửa kết luận đánh giá",
    score: "Điểm đánh giá",
    placeholderfromScore: "Từ",
    placeholdertoScore: "Đến",
    conclude: "Kết luận đánh giá",
    placeholderConclude: "Nhập kết luận đánh giá",
  },

  // Placeholder
  placeholder: {
    advanceFilter: "Tìm kiếm nâng cao",
    code: "Nhập mã Bộ tiêu chí đánh giá",
    name: "Nhập tên Bộ tiêu chí đánh giá",
    value: "Nhập giá trị",
    maximumScore: "Nhập điểm tối đa",
    description: "Nhập mô tả",
  },
  errorEvaluationItem: {
    codeEmpty: "Trường thông tin không được để trống",
    codeTooLong: "Vuợt quá 255 ký tự",
    codeDuplicate: "Mã tiêu chí đã tồn tại",
    weightEmpty: "Trường thông tin không được để trống",
    nameEmpty: "Trường thông tin không được để trống",
    nameTooLong: "Vuợt quá 255 ký tự",
    standardEmpty: "Trường thông tin không được để trống",
    standardTooLong: "Vuợt quá 500 ký tự",
  },

  errorEvaluationResult: {
    concludeEmpty: "Trường thông tin không được để trống",
    concludeTooLong: "Vuợt quá 500 ký tự",
    fromScoreEmpty: "Trường thông tin không được để trống",
    fromScoreInvalidRange: "Khoảng giá trị không hợp lệ",
    toScoreEmpty: "Trường thông tin không được để trống",
    toScoreInvalidRange: "Khoảng giá trị không hợp lệ",
    invalidFromTo: "Giá trị điểm đến phải lớn hơn giá trị điểm từ",
  },

  // message
  copied_to_clipboard_message: "Đã sao chép vào bộ nhớ tạm",
  cost_line_delete_succeed_message:
    "Đã xóa {{total}} bản ghi bộ tiêu chí đánh giá",
  update_cost_line_succeed_message: "Chỉnh sửa thời gian thành công",
  create_cost_line_succeed_message: "Tạo mới thời gian thành công",
  yes_txt: "Có",
  no_txt: "Không",
  all_txt: "Tất cả",
};
