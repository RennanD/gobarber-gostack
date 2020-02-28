import styled, { css } from 'styled-components';
import PerfectScrollBar from 'react-perfect-scrollbar';

export const Container = styled.div`
  position: relative;
`;

export const Badge = styled.button`
  background: none;
  border: 0;
  position: relative;
  ${props =>
    props.hasUnread &&
    css`
      &::after {
        position: absolute;
        right: 0;
        top: 0;
        height: 8px;
        width: 8px;
        border-radius: 4px;
        background: #dc3545;
        content: '';
      }
    `}
`;

export const NotificationList = styled.div`
  position: absolute;
  width: 260px;
  left: calc(50% - 130px);
  top: calc(100% + 30px);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  padding: 15px 5px;
  display: ${props => (props.visible ? 'block' : 'none')};

  &::before {
    content: '';
    position: absolute;
    left: calc(50% - 20px);
    top: -20px;
    height: 0;
    width: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid rgba(0, 0, 0, 0.7);
  }
`;

export const Notification = styled.div`
  color: #fff;

  & + div {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  p {
    font-size: 13px;
    line-height: 18px;
  }

  time {
    font-size: 12px;
    display: block;
    opacity: 0.6;
    margin-bottom: 5px;
  }

  button {
    font-size: 12px;
    border: 0;
    background: none;
    color: #7159c1;

    ${props =>
      props.unRead &&
      css`
        &::after {
          content: '';
          display: inline-block;
          margin-left: 5px;
          width: 8px;
          height: 8px;
          background: #dc3545;
          border-radius: 50%;
        }
      `}
  }
`;

export const Scroll = styled(PerfectScrollBar)`
  max-height: 260px;
  padding: 5px 15px;
`;
