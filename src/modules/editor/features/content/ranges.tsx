import React, { useState, useEffect } from "react"
import { Spacer, useTheme, ButtonDropdown } from "@geist-ui/react"
import RangeOption from "@/components/range-option"
import { Range, RangesCharacter } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"

type Prop = {
  ranges: Range[]
}
const Ranges: React.FC<Prop> = ({ ranges }) => {
  const [, dispatch] = useMainReducer()
  const { palette } = useTheme()

  const addRange = () => {
    const val: RangesCharacter = {
      type: "ranges",
      value: ranges.concat({ from: "", to: "" }),
      negate: false,
    }
    dispatch({
      type: MainActionTypes.EDIT_CHARACTER,
      payload: {
        val,
      },
    })
  }

  const handleRangeChange = (index: number, range: Range) => {
    // Todo: special action
    const val: RangesCharacter = {
      type: "ranges",
      value: ranges.map((_range, _index) => {
        if (_index === index) {
          return range
        }
        return _range
      }),
      negate: false,
    }
    dispatch({
      type: MainActionTypes.EDIT_CHARACTER,
      payload: {
        val,
      },
    })
  }

  const handleRemove = (index: number) => {
    const val: RangesCharacter = {
      type: "ranges",
      value: ranges.filter((_, _index) => {
        return index !== _index
      }),
      negate: false,
    }
    dispatch({
      type: MainActionTypes.EDIT_CHARACTER,
      payload: {
        val,
      },
    })
  }
  return (
    <>
      <div className="range-options">
        {ranges.map((range, index) => (
          <RangeOption
            range={range}
            key={index}
            onChange={(range: Range) => handleRangeChange(index, range)}
            onRemove={() => handleRemove(index)}
          />
        ))}
      </div>
      <Spacer />
      <ButtonDropdown size="small">
        <ButtonDropdown.Item main onClick={addRange}>
          Create A Empty Range
        </ButtonDropdown.Item>
      </ButtonDropdown>
      <style jsx>{`
        h6 {
          color: ${palette.secondary};
        }
        .range-options > :global(.range-wrapper:not(:first-child)) {
          margin-top: 12px;
        }
      `}</style>
    </>
  )
}

export default Ranges
