/* eslint-disable no-unused-vars */
import HeartShareButton from HeartShareButton

export default {
  title: "Commons/Buttons/HeartShareButton",
  component: HeartShareButton,
  tags: ["autodocs"],
  args: {
    children: "버튼 텍스트",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "200px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const Black = {
  args: {
    variant: "black",
    children: "블랙 버튼",
  },
};

export const White = {
  args: {
    variant: "white",
    children: "화이트 버튼",
  },
};
