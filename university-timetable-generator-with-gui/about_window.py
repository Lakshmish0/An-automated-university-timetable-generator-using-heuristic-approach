from PyQt5 import QtCore, QtGui, QtWidgets
import lightstyle

class Ui_aboutWindow(object):
    def setupUi(self, aboutWindow):
        aboutWindow.setObjectName("aboutWindow")
        aboutWindow.resize(800, 450)
        aboutWindow.setStyleSheet(lightstyle.css.replace('bgwlogo.png', 'bgwlogo.jpg'))
        aboutWindow.setWindowIcon(QtGui.QIcon('icons/favicon.ico'))
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Fixed, QtWidgets.QSizePolicy.Fixed)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(aboutWindow.sizePolicy().hasHeightForWidth())
        aboutWindow.setSizePolicy(sizePolicy)
        aboutWindow.setMinimumSize(QtCore.QSize(800, 450))
        aboutWindow.setMaximumSize(QtCore.QSize(800, 450))
        self.gridLayoutWidget = QtWidgets.QWidget(aboutWindow)
        self.gridLayoutWidget.setGeometry(QtCore.QRect(0, 0, 801, 441))
        self.gridLayoutWidget.setObjectName("gridLayoutWidget")
        self.gridLayout = QtWidgets.QGridLayout(self.gridLayoutWidget)
        self.gridLayout.setContentsMargins(5, 0, 5, 0)
        self.gridLayout.setObjectName("gridLayout")
        self.logoLabel = QtWidgets.QLabel(self.gridLayoutWidget)
        self.logoLabel.setText("")
        self.logoLabel.setAlignment(QtCore.Qt.AlignBottom|QtCore.Qt.AlignLeading|QtCore.Qt.AlignLeft)
        self.logoLabel.setObjectName("logoLabel")
        self.gridLayout.addWidget(self.logoLabel, 0, 0, 1, 1)
        self.line = QtWidgets.QFrame(self.gridLayoutWidget)
        self.line.setFrameShape(QtWidgets.QFrame.HLine)
        self.line.setFrameShadow(QtWidgets.QFrame.Sunken)
        self.line.setObjectName("line")
        self.gridLayout.addWidget(self.line, 1, 0, 1, 3)
        self.horizontalLayout = QtWidgets.QHBoxLayout()
        self.horizontalLayout.setContentsMargins(0, -1, 0, -1)
        self.horizontalLayout.setObjectName("horizontalLayout")
        spacerItem = QtWidgets.QSpacerItem(40, 20, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        self.horizontalLayout.addItem(spacerItem)
        self.closeBtn = QtWidgets.QPushButton(self.gridLayoutWidget)
        self.closeBtn.setMinimumSize(QtCore.QSize(100, 30))
        self.closeBtn.setStyleSheet("background-color: #ffffff; color: Black;")
        font = QtGui.QFont()
        font.setFamily("Century Gothic")
        font.setPointSize(10)
        self.closeBtn.setFont(font)
        self.closeBtn.setObjectName("closeBtn")
        self.horizontalLayout.addWidget(self.closeBtn)
        self.gridLayout.addLayout(self.horizontalLayout, 5, 0, 1, 3)
        self.label = QtWidgets.QLabel(self.gridLayoutWidget)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Preferred, QtWidgets.QSizePolicy.Fixed)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.label.sizePolicy().hasHeightForWidth())
        self.label.setSizePolicy(sizePolicy)
        self.label.setMinimumSize(QtCore.QSize(0, 40))
        font = QtGui.QFont()
        font.setFamily("Century Gothic")
        font.setPointSize(12)
        self.label.setFont(font)
        self.label.setAlignment(QtCore.Qt.AlignCenter)
        self.label.setObjectName("label")
        self.gridLayout.addWidget(self.label, 0, 1, 1, 1)
        self.line_2 = QtWidgets.QFrame(self.gridLayoutWidget)
        self.line_2.setFrameShape(QtWidgets.QFrame.HLine)
        self.line_2.setFrameShadow(QtWidgets.QFrame.Sunken)
        self.line_2.setObjectName("line_2")
        self.gridLayout.addWidget(self.line_2, 4, 0, 1, 3)
        self.scrollArea = QtWidgets.QScrollArea(self.gridLayoutWidget)
        self.scrollArea.setWidgetResizable(True)
        self.scrollArea.setObjectName("scrollArea")
        self.scrollAreaWidgetContents = QtWidgets.QWidget()
        self.scrollAreaWidgetContents.setGeometry(QtCore.QRect(0, 0, 789, 331))
        self.scrollAreaWidgetContents.setObjectName("scrollAreaWidgetContents")
        self.label_2 = QtWidgets.QLabel(self.scrollAreaWidgetContents)
        self.label_2.setGeometry(QtCore.QRect(50, 0, 671, 331))
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Preferred, QtWidgets.QSizePolicy.Minimum)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.label_2.sizePolicy().hasHeightForWidth())
        self.label_2.setSizePolicy(sizePolicy)
        self.label_2.setMinimumSize(QtCore.QSize(0, 219))
        font = QtGui.QFont()
        font.setFamily("Century Gothic")
        font.setPointSize(12)
        self.label_2.setFont(font)
        self.label_2.setAlignment(QtCore.Qt.AlignCenter)
        self.label_2.setObjectName("label_2")
        self.scrollArea.setWidget(self.scrollAreaWidgetContents)
        self.gridLayout.addWidget(self.scrollArea, 3, 0, 1, 3)

        self.retranslateUi(aboutWindow)
        QtCore.QMetaObject.connectSlotsByName(aboutWindow)

    def retranslateUi(self, aboutWindow):
        _translate = QtCore.QCoreApplication.translate
        aboutWindow.setWindowTitle(_translate("aboutWindow", "About"))
        self.closeBtn.setText(_translate("aboutWindow", "Close"))
        self.label.setText(_translate("aboutWindow", "𝓐𝓾𝓽𝓸𝓶𝓪𝓽𝓮𝓭 𝓤𝓷𝓲𝓿𝓮𝓻𝓼𝓲𝓽𝔂 𝓓𝓮𝓹𝓪𝓻𝓽𝓶𝓮𝓷𝓽 𝓣𝓲𝓶𝓮𝓽𝓪𝓫𝓵𝓲𝓷𝓰 𝓢𝔂𝓼𝓽𝓮𝓶"))
        self.label_2.setText(_translate("aboutWindow", "🄳🄴🅅🄴🄻🄾🄿🄴🄳 🄱🅈:\n"
"𝗞𝗼𝘂𝘀𝗵𝗶𝗸 𝗦 𝗝𝗮𝗶𝗻\n"
"𝗟𝗮𝗸𝘀𝗵𝗺𝗶𝘀𝗵 𝗬\n"
"𝗣𝗿𝗶𝘁𝗵𝘃𝗶 𝗦𝗿𝗶𝗻𝗶𝘃𝗮𝘀\n"
"\n"
"🅄🄽🄳🄴🅁 🄶🅄🄸🄳🄰🄽🄲🄴 🄾🄵:\n"
"𝙈𝙨. 𝙑𝙖𝙣𝙞 𝙕𝙪𝙣𝙟𝙖𝙧𝙬𝙖𝙙\n"
"𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗼𝗿\n"
"\n"
"𝔻𝕖𝕡𝕒𝕣𝕥𝕞𝕖𝕟𝕥 𝕠𝕗 𝔸𝕣𝕥𝕚𝕗𝕚𝕔𝕚𝕒𝕝 𝕀𝕟𝕥𝕖𝕝𝕝𝕚𝕘𝕖𝕟𝕔𝕖 𝕒𝕟𝕕 𝕄𝕒𝕔𝕙𝕚𝕟𝕖 𝕃𝕖𝕒𝕣𝕟𝕚𝕟𝕘\n"
"\n"
"𝓡𝓝𝓢 𝓘𝓷𝓼𝓽𝓲𝓽𝓾𝓽𝓮 𝓸𝓯 𝓣𝓮𝓬𝓱𝓷𝓸𝓵𝓸𝓰𝔂, 𝓑𝓮𝓷𝓰𝓪𝓵𝓾𝓻𝓾"))


if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    aboutWindow = QtWidgets.QDialog()
    ui = Ui_aboutWindow()
    ui.setupUi(aboutWindow)
    aboutWindow.show()
    sys.exit(app.exec_())
