/**
 * File containing components and data related to The Shroud.
 * 
 * Written by Will Owens (wowens4@gmu.edu)
 */

import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import { Polygon } from 'react-native-maps';

import styles from './styles';
import viennaStorage from './viennaStorage';

/** 
 * Functional component representing a polygon making up part of the shroud.
 * When created, the style, coordinates, fillColor, strokeColor and strokeWidth props should be supplied.
 * Forwards a ref containing a getter and setter for visibility (whether the polygon is visibly rendered or not)
*/
const ShroudPolygon = forwardRef(function Shroudpolygon(props, ref) {
  // a state is just a variable that is assigned to a component. if it is updated, the component re-renders.
  // a ref is a way of exposing some value of a component to another component (a parent). updating info in a ref does not always re-render the component.

  const [isVisible, setIsVisible] = useState(true)
  const shroudPolygonRef = useRef(null) // ref for THIS polygon, is used by an imperativeHandle, not exposed to parents directly.
  // the initial value of the ref doesn't matter, since it will be overwritten by the useImperativeHandle call below

  // useImperativeHandle exposes only parts of a component as functions
  // it points the supplied ref at these functions, which are now exposed to the parent component that created the ref
  // here, we supply getters and setters for the isVisible state
  useImperativeHandle(ref, () => {
    return {
      setVisibility(to) {
        setIsVisible(to)
      },
      getVisibility() {
        return isVisible
      }
    }
  })

  // actual rendering code. if the polygon is invisible, it's just an empty <View> element.
  if (!isVisible) {
    return <View
      ref={shroudPolygonRef}
    />
  }

  // otherwise, it's a real <Polygon>.
  return (
    <Polygon
      style={props.style}
      coordinates={props.coordinates}
      fillColor={props.fillColor}
      strokeColor={props.strokeColor}
      strokeWidth={props.strokeWidth}
      ref={shroudPolygonRef}
    />
  )
})

/**
 * Functional component. holds the district shrouds and manages their states.
 * No mandatory props needed.
 * Forwards a ref containing a getter and setter for individual polygons' visibilities. If an invalid index is supplied to either of these, null will be returned.
 * The ref also exposes a length method to return the number of polygons in the container (in practice, this will always be 23).
*/ 
export const ShroudContainer = forwardRef(function ShroudContainer(props, ref) {
  const shroudPolygonElements = []  // the actual <ShroudPolygon>s. (this gets returned)
  const shroudPolygonRefs = []      // refs for each <ShroudPolygon>. (these are not directly exposed to parents)

  useImperativeHandle(ref, () => {
    return {
      setVisibility(index, to) {
        if (index > shroudPolygonRefs.length || index < 0) {
          return null
        }
        shroudPolygonRefs[index].current.setVisibility(to)
      },
      getVisibility(index) {
        if (index > shroudPolygonRefs.length || index < 0) {
          return null
        }
        return shroudPolygonRefs[index].current.getVisibility()
      },
      length() {
        return shroudPolygonRefs.length()
      }
    }
  })

  // construct individual shroud polygons and store refs to them
  for (var i = 0; i < viennaStorage.json.verts.verts.length; i++) {
    shroudPolygonRefs.push(useRef(null))
    const spi = "shroud-polygon-" + (i + 1) // when creating components like this in a loop, keys cannot be inferred. 
    // in order for the DOM to not explode, these must be supplied manually.

    currPoly = <ShroudPolygon
      key={spi}
      style={styles.shroudPolygon}
      coordinates={viennaStorage.json.verts.verts[i]}
      fillColor={viennaStorage.json.verts.fillColors[i]}
      strokeColor={viennaStorage.json.verts.borderColors[i]}
      strokeWidth={2}
      ref={shroudPolygonRefs[i]}
    />

    shroudPolygonElements.push(currPoly)
  }

  return shroudPolygonElements
})


export default ShroudContainer;