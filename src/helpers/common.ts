export const data = [
  {
    id: 1,
    label: "Обязательные для всех",
    specLabel: "Обязательный",
    extraLabel: "Документы, обязательные для всех сотрудников без исключения",
    isCategory: true,
    colors: ["#FF238D", "#FFB800", "#FF8D23"],
    children: [
      {
        id: 7,
        label: "Паспорт",
        specLabel: "Обязательный",
        extraLabel: "Для всех",
        colors: ["#00C2FF"],
      },
      {
        id: 8,
        label: "ИНН",
        specLabel: "Обязательный",
        extraLabel: "Для всех",
      },
    ],
  },
  {
    id: 2,
    label: "Обязательные для трудоустройства",
    extraLabel:
      "Документы, без которых невозможно трудоустройство человека на какую бы то ни было должность в компании вне зависимости от гражданства",
    isCategory: true,
    children: [
      {
        id: 9,
        label: "СНИЛС",
      },
      {
        id: 10,
        label: "Военный билет",
      },
    ],
  },
  {
    id: 3,
    label: "Специальные",
    isCategory: true,
    children: [
      {
        id: 11,
        label: "Водит. права кат. Б",
      },
      {
        id: 12,
        label: "Водит. права кат. В",
      },
    ],
  },
  {
    id: 13,
    label: "",
  },
  {
    id: 4,
    label: "Тестовое задание кандидата",
    simple: true,
    extraLabel:
      "Россия, Белоруссия, Украина, администратор филиала, повар-сушист, повар-пиццмейкер, повар горячего цеха",
  },
  {
    id: 5,
    label: "Трудовой договор",
    colors: ["#0066FF", "#8E9CBB"],
    simple: true,
  },
  {
    id: 6,
    label: "Мед. книжка",
    simple: true,
  },
];
