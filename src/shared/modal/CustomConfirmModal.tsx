import * as React from "react";

import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  Modal,
  IIconProps,
  // IStackProps,
  Stack,
  PrimaryButton,
  DefaultButton,
  mergeStyles,
} from "office-ui-fabric-react";
import { IconButton, IButtonStyles } from "office-ui-fabric-react";
import { useEffect, useState } from "react";
import { ICustomConfirmModalProps } from "./ICustomConfirmModalProps";

export const CustomConfirmModal = (
  customConfirmModalProps: ICustomConfirmModalProps
) => {
  const [isModalOpen, setModalOpen] = useState(
    customConfirmModalProps.IsModalOpen
  );

  useEffect(() => {
    setModalOpen(isModalOpen);
  });
  //}, [isPopup]);

  let _btnCont = mergeStyles({ paddingTop: 20 });

  const cancelIcon: IIconProps = { iconName: "Cancel" };

  const theme = getTheme();
  const contentStyles = mergeStyleSets({
    container: {
      display: "flex",
      flexFlow: "column nowrap",
      alignItems: "stretch",
    },
    header: [
      // eslint-disable-next-line deprecation/deprecation
      theme.fonts.xLarge,
      {
        flex: "1 1 auto",
        borderTop: "4px solid ${theme.palette.themePrimary}",
        color: theme.palette.neutralPrimary,
        display: "flex",
        alignItems: "center",
        fontWeight: FontWeights.semibold,
        padding: "12px 12px 14px 24px",
      },
    ],
    body: {
      flex: "4 4 auto",
      padding: "0 24px 24px 24px",
      overflowY: "hidden",
      selectors: {
        p: { margin: "14px 0" },
        "p:first-child": { marginTop: 0 },
        "p:last-child": { marginBottom: 0 },
      },
    },
  });
  // const stackProps: Partial<IStackProps> = {
  //   horizontal: true,
  //   tokens: { childrenGap: 40 },
  //   styles: { root: { marginBottom: 20 } },
  // };
  const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: "auto",
      marginTop: "4px",
      marginRight: "2px",
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };

  const CancelHandler = (): void => {
    setModalOpen(false);
    //setisPopup(current => !current)
    customConfirmModalProps.HandleCancel();
  };

  const ConfirmHandler = (): void => {
    setModalOpen(false);
    //setisPopup(current => !current)
    customConfirmModalProps.HandleDelConfirm(customConfirmModalProps.ItemID, customConfirmModalProps.ListID);
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onDismiss={CancelHandler}
        isBlocking={true}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>
          <span>{customConfirmModalProps.ModalTitle}</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={() => CancelHandler}
          />
        </div>
        <div className={contentStyles.body}>
          <p>{customConfirmModalProps.ModalBody}</p>
          <Stack
            className={_btnCont}
            horizontal
            horizontalAlign="end"
            tokens={{ childrenGap: 10 }}
          >
            <PrimaryButton text="Confirm" onClick={() => ConfirmHandler()} />
            <DefaultButton text="Cancel" onClick={() => CancelHandler()} />
          </Stack>
        </div>
      </Modal>
    </div>
  );
};
