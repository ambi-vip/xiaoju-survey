export const menuItems = {
  text: {
    type: 'text',
    snapshot: '/imgs/question-type-snapshot/iL84te6xxU1657702189333.webp',
    path: 'InputModule',
    icon: 'tixing-danhangshuru',
    title: '单行输入框'
  },
  textarea: {
    type: 'textarea',
    snapshot: '/imgs/question-type-snapshot/11iAo3ca0u1657702225416.webp',
    path: 'TextareaModule',
    icon: 'tixing-duohangshuru',
    title: '多行输入框'
  },
  'number-input': {
    type: 'number-input',
    snapshot: '/imgs/question-type-snapshot/iL84te6xxU1657702189333.webp',
    path: 'NumberInputModule',
    icon: 'tixing-danhangshuru',
    title: '数字'
  },
  datetime: {
    type: 'datetime',
    snapshot: '/imgs/question-type-snapshot/iL84te6xxU1657702189333.webp',
    path: 'DateTimeModule',
    icon: 'tixing-danhangshuru',
    title: '日期时间'
  },
  radio: {
    type: 'radio',
    snapshot: '/imgs/question-type-snapshot/TgeRDfURJZ1657702220602.webp',
    icon: 'tixing-danxuan',
    path: 'RadioModule',
    title: '单项选择'
  },
  checkbox: {
    type: 'checkbox',
    path: 'CheckboxModule',
    snapshot: '/imgs/question-type-snapshot/Md2YmzBBpV1657702223744.webp',
    icon: 'tixing-duoxuan',
    title: '多项选择'
  },
  'binary-choice': {
    type: 'binary-choice',
    snapshot: '/imgs/question-type-snapshot/blW8U1ckzd1657702223023.webp',
    path: 'BinaryChoiceModule',
    icon: 'tixing-panduanti',
    title: '判断题'
  },
  select: {
    type: 'select',
    snapshot: '/imgs/question-type-snapshot/TgeRDfURJZ1657702220602.webp',
    path: 'SelectModule',
    icon: 'tixing-danxuan',
    title: '下拉选择'
  },
  'radio-star': {
    type: 'radio-star',
    snapshot: '/imgs/question-type-snapshot/7CU6tn4XqT1657702221208.webp',
    path: 'StarModule',
    icon: 'tixing-pingfen',
    title: '评分'
  },
  'radio-nps': {
    type: 'radio-nps',
    path: 'NpsModule',
    snapshot: '/imgs/question-type-snapshot/radio-nps.webp',
    icon: 'NPSpingfen',
    title: 'nps评分'
  },
  vote: {
    type: 'vote',
    path: 'VoteModule',
    snapshot: '/imgs/question-type-snapshot/nGTscsZlwn1657702222857.webp',
    icon: 'tixing-toupiao',
    title: '投票'
  },
  ranking: {
    type: 'ranking',
    path: 'RankingModule',
    snapshot: '/imgs/question-type-snapshot/TgeRDfURJZ1657702220602.webp',
    icon: 'tixing-danxuan',
    title: '排序题'
  },
  cascader: {
    type: 'cascader',
    path: 'CascaderModule',
    snapshot: '/imgs/question-type-snapshot/cascader.webp',
    icon: 'cascader-select',
    title: '多级联动'
  },
  'matrix-choice': {
    type: 'matrix-choice',
    path: 'MatrixChoiceModule',
    snapshot: '/imgs/question-type-snapshot/matrix-choice.webp',
    icon: 'tixing-juzhen',
    title: '矩阵选择'
  },
  'matrix-scale': {
    type: 'matrix-scale',
    path: 'MatrixScaleModule',
    // snapshot: '/imgs/question-type-snapshot/matrix-scale.webp', // TODO: Add snapshot
    icon: 'tixing-pingfen',
    title: '矩阵评分'
  },
  'matrix-nps': {
    type: 'matrix-nps',
    path: 'MatrixNpsModule',
    // snapshot: '/imgs/question-type-snapshot/matrix-nps.webp',
    icon: 'tixing-pingfen',
    title: '矩阵NPS'
  },
  'matrix-input': {
    type: 'matrix-input',
    path: 'MatrixInputModule',
    // snapshot: '/imgs/question-type-snapshot/matrix-input.webp',
    icon: 'tixing-juzhen',
    title: '矩阵填空'
  },
  'matrix-textarea': {
    type: 'matrix-textarea',
    path: 'MatrixTextareaModule',
    // snapshot: '/imgs/question-type-snapshot/matrix-textarea.webp',
    icon: 'tixing-juzhen',
    title: '矩阵多行'
  },
  'file-upload': {
    type: 'file-upload',
    path: 'FileUploadModule',
    // snapshot: '/imgs/question-type-snapshot/file-upload.webp',
    icon: 'tixing-danhangshuru',
    title: '文件上传'
  },
  'image-upload': {
    type: 'image-upload',
    path: 'ImageUploadModule',
    // snapshot: '/imgs/question-type-snapshot/image-upload.webp',
    icon: 'tixing-danhangshuru',
    title: '图片上传'
  }
}

const menuGroup = [
  {
    title: '输入类题型',
    questionList: ['text', 'textarea', 'number-input', 'datetime']
  },
  {
    title: '选择类题型',
    questionList: ['radio', 'checkbox', 'binary-choice', 'select', 'ranking', 'radio-star', 'radio-nps', 'vote']
  },
  {
    title: '矩阵类题型',
    questionList: ['matrix-choice', 'matrix-scale', 'matrix-nps', 'matrix-input', 'matrix-textarea']
  },
  {
    title: '高级题型',
    questionList: ['cascader', 'image-upload', 'file-upload']
  }
]

const menu = menuGroup.map((group) => {
  group.questionList = group.questionList.map((question) => menuItems[question])
  return group
})

export const questionTypeList = Object.values(menuItems)

export default menu
