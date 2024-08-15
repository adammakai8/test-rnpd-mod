import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native'
import { useTheme, TouchableRipple, MD2Theme } from 'react-native-paper'

import Color from 'color'
import {
  inputTypes,
  PossibleClockTypes,
  PossibleInputTypes,
  useInputColors,
} from './timeUtils'
import { forwardRef, useEffect, useState } from 'react'
import React from 'react'
import { sharedStyles } from '../shared/styles'

interface TimeInputProps
  extends Omit<Omit<TextInputProps, 'value'>, 'onFocus'> {
  value: number
  clockType: PossibleClockTypes
  onPress?: (type: PossibleClockTypes) => any
  pressed: boolean
  onChanged: (n: number) => any
  inputType: PossibleInputTypes
  inputFontSize?: number
  showRipple?: boolean
}

function TimeInput(
  {
    value,
    clockType,
    pressed,
    onPress,
    onChanged,
    inputType,
    inputFontSize = 48,
    showRipple = true,
    ...rest
  }: TimeInputProps,
  ref: any
) {
  const theme = useTheme()
  const [inputFocused, setInputFocused] = useState<boolean>(false)

  const [controlledValue, setControlledValue] = useState(`${value}`)

  const highlighted = inputType === inputTypes.picker ? pressed : inputFocused

  const { color, backgroundColor } = useInputColors(highlighted)

  useEffect(() => {
    setControlledValue(`${value}`)
  }, [value])

  const onInnerChange = (text: string) => {
    setControlledValue(text)
    if (text !== '' && text !== '0') {
      onChanged(Number(text))
    }
  }

  const ConditionalRipple = showRipple ? TouchableRipple : Pressable

  let formattedValue = controlledValue
  if (!inputFocused) {
    formattedValue =
      controlledValue.length === 1
        ? `0${controlledValue}`
        : `${controlledValue}`
  }

  return (
    <View style={styles.root}>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            color,
            fontFamily: theme?.isV3
              ? theme.fonts.titleMedium.fontFamily
              : (theme as any as MD2Theme).fonts.medium.fontFamily,
            fontSize: inputFontSize,
            backgroundColor,
            borderRadius: theme.roundness * 3,
            borderColor:
              theme.isV3 && highlighted
                ? theme.colors.onPrimaryContainer
                : undefined,
            borderWidth: theme.isV3 && highlighted ? 2 : 0,
            paddingTop: 6,
            paddingBottom: 12,
            marginTop: 5,
            width: 116,
          },
        ]}
        maxFontSizeMultiplier={1.5}
        value={formattedValue}
        maxLength={2}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        keyboardAppearance={theme.dark ? 'dark' : 'default'}
        keyboardType="number-pad"
        onChangeText={onInnerChange}
        {...rest}
      />
      {onPress && inputType === inputTypes.picker ? (
        <ConditionalRipple
          style={[
            StyleSheet.absoluteFill,
            sharedStyles.overflowHidden,
            {
              borderRadius: theme.roundness,
            },
          ]}
          rippleColor={
            Platform.OS !== 'ios'
              ? Color(theme.colors.onSurface).fade(0.7).hex()
              : undefined
          }
          onPress={() => onPress(clockType)}
          borderless={true}
        >
          <View />
        </ConditionalRipple>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 'auto',
  },
  root: {
    height: 100,
    position: 'relative',
    width: 150,
  },
})

export default forwardRef(TimeInput)
