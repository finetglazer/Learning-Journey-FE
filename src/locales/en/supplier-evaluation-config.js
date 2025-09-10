export default {
  title: "Supplier Evaluation Configuration",
  create: "Create New Evaluation Criteria Set",
  update: "Update Evaluation Criteria Set",
  preview: "Evaluation Criteria Set Details",
  advanceFilter: "Advanced Search",
  message_empty_data: "Your system has not recorded any data. ",
  let_add_new: "Please add new Evaluation Criteria Set data",
  // Breadcrumbs
  breadcrumbs: {
    home: "Home",
    supplierEvaluationConfig: "Supplier Evaluation Configuration",
  },

  // Table title
  code: "Evaluation Criteria Set Code",
  name: "Evaluation Criteria Set Name",
  maximumScore: "Maximum Score",

  status: "Status",
  active: "Active",
  description: "Description",
  inactive: "Inactive",
  deleteTitle: "Confirm Delete Evaluation Criteria Set",
  bulkDeleteTitle1: "Confirm Delete",
  bulkDeleteTitle2: "evaluation criteria sets",
  deleteContent:
    "This action cannot be undone. Are you sure you want to delete the selected evaluation criteria set",

  txt_stt: "No.",
  evaluationItem: "Evaluation Criteria",
  emptyEvaluationItem: "No Evaluation Criteria Information",
  addItem: "Add Criteria",
  evaluationResult: "Evaluation Conclusion",
  emptyDataResult: "No Evaluation Conclusion Information",
  addResult: "Add Conclusion",
  totalWeight: "Total",

  evaluationItems: {
    code: "Criteria Code",
    name: "Criteria Name",
    weight: "Weight",
    standard: "Standard",
  },
  evaluationResults: {
    fromScore: "Score From",
    toScore: "Score To",
    conclude: "Conclusion",
  },
  detailItemModal: {
    create: "Create New Evaluation Criteria",
    detail: "Edit Evaluation Criteria",
    code: "Criteria Code",
    name: "Criteria Name",
    weight: "Weight",
    standard: "Standard",
    placeholderCode: "Enter criteria code",
    placeholderWeight: "Enter weight",
    placeholderName: "Enter criteria name",
    placeholderStandard: "Enter standard",
  },
  detailResultModal: {
    create: "Create New Evaluation Conclusion",
    detail: "Edit Evaluation Conclusion",
    score: "Evaluation Score",
    placeholderfromScore: "From",
    placeholdertoScore: "To",
    conclude: "Evaluation Conclusion",
    placeholderConclude: "Enter evaluation conclusion",
  },

  // Placeholder
  placeholder: {
    advanceFilter: "Advanced Search",
    code: "Enter Evaluation Criteria Set Code",
    name: "Enter Evaluation Criteria Set Name",
    value: "Enter value",
    maximumScore: "Enter maximum score",
    description: "Enter description",
  },
  errorEvaluationItem: {
    codeEmpty: "Field cannot be empty",
    codeTooLong: "Exceeds 255 characters",
    codeDuplicate: "Criteria code already exists",
    weightEmpty: "Field cannot be empty",
    nameEmpty: "Field cannot be empty",
    nameTooLong: "Exceeds 255 characters",
    standardEmpty: "Field cannot be empty",
    standardTooLong: "Exceeds 500 characters",
  },

  errorEvaluationResult: {
    concludeEmpty: "Field cannot be empty",
    concludeTooLong: "Exceeds 500 characters",
    fromScoreEmpty: "Field cannot be empty",
    fromScoreInvalidRange: "Invalid range",
    toScoreEmpty: "Field cannot be empty",
    toScoreInvalidRange: "Invalid range",
    invalidFromTo: "To score must be greater than from score",
  },

  // message
  copied_to_clipboard_message: "Copied to clipboard",
  cost_line_delete_succeed_message:
    "Deleted {{total}} evaluation criteria set records",
  update_cost_line_succeed_message: "Successfully updated time",
  create_cost_line_succeed_message: "Successfully created time",
  yes_txt: "Yes",
  no_txt: "No",
  all_txt: "All",
};
