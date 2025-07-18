const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ['assets/AboutView-Bj9v4g9p.js', 'assets/AboutView-CSIvawM9.css']),
) => i.map((i) => d[i])
;(function () {
  const n = document.createElement('link').relList
  if (n && n.supports && n.supports('modulepreload')) return
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) s(r)
  new MutationObserver((r) => {
    for (const i of r)
      if (i.type === 'childList')
        for (const a of i.addedNodes) a.tagName === 'LINK' && a.rel === 'modulepreload' && s(a)
  }).observe(document, { childList: !0, subtree: !0 })
  function o(r) {
    const i = {}
    return (
      r.integrity && (i.integrity = r.integrity),
      r.referrerPolicy && (i.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === 'use-credentials'
        ? (i.credentials = 'include')
        : r.crossOrigin === 'anonymous'
          ? (i.credentials = 'omit')
          : (i.credentials = 'same-origin'),
      i
    )
  }
  function s(r) {
    if (r.ep) return
    r.ep = !0
    const i = o(r)
    fetch(r.href, i)
  }
})()
function _defineProperty(t, n, o) {
  return (
    (n = _toPropertyKey(n)) in t
      ? Object.defineProperty(t, n, { value: o, enumerable: !0, configurable: !0, writable: !0 })
      : (t[n] = o),
    t
  )
}
function ownKeys(t, n) {
  var o = Object.keys(t)
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(t)
    n &&
      (s = s.filter(function (r) {
        return Object.getOwnPropertyDescriptor(t, r).enumerable
      })),
      o.push.apply(o, s)
  }
  return o
}
function _objectSpread2(t) {
  for (var n = 1; n < arguments.length; n++) {
    var o = arguments[n] != null ? arguments[n] : {}
    n % 2
      ? ownKeys(Object(o), !0).forEach(function (s) {
          _defineProperty(t, s, o[s])
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(o))
        : ownKeys(Object(o)).forEach(function (s) {
            Object.defineProperty(t, s, Object.getOwnPropertyDescriptor(o, s))
          })
  }
  return t
}
function _objectWithoutProperties(t, n) {
  if (t == null) return {}
  var o,
    s,
    r = _objectWithoutPropertiesLoose(t, n)
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t)
    for (s = 0; s < i.length; s++)
      (o = i[s]), n.indexOf(o) === -1 && {}.propertyIsEnumerable.call(t, o) && (r[o] = t[o])
  }
  return r
}
function _objectWithoutPropertiesLoose(t, n) {
  if (t == null) return {}
  var o = {}
  for (var s in t)
    if ({}.hasOwnProperty.call(t, s)) {
      if (n.indexOf(s) !== -1) continue
      o[s] = t[s]
    }
  return o
}
function _toPrimitive(t, n) {
  if (typeof t != 'object' || !t) return t
  var o = t[Symbol.toPrimitive]
  if (o !== void 0) {
    var s = o.call(t, n)
    if (typeof s != 'object') return s
    throw new TypeError('@@toPrimitive must return a primitive value.')
  }
  return (n === 'string' ? String : Number)(t)
}
function _toPropertyKey(t) {
  var n = _toPrimitive(t, 'string')
  return typeof n == 'symbol' ? n : n + ''
}
var _excluded = ['width', 'height', 'viewBox'],
  _excluded2 = ['tabindex'],
  defaultAttributes = { focusable: 'false', preserveAspectRatio: 'xMidYMid meet' }
function getAttributes() {
  var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
    n = t.width,
    o = t.height,
    s = t.viewBox,
    r = s === void 0 ? '0 0 '.concat(n, ' ').concat(o) : s,
    i = _objectWithoutProperties(t, _excluded),
    a = i.tabindex,
    c = _objectWithoutProperties(i, _excluded2),
    u = _objectSpread2(
      _objectSpread2(_objectSpread2({}, defaultAttributes), c),
      {},
      { width: n, height: o, viewBox: r },
    )
  return (
    u['aria-label'] || u['aria-labelledby'] || u.title
      ? ((u.role = 'img'), a != null && ((u.focusable = 'true'), (u.tabindex = a)))
      : (u['aria-hidden'] = !0),
    u
  )
}
/**
 * @vue/shared v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ /*! #__NO_SIDE_EFFECTS__ */ function makeMap(t) {
  const n = Object.create(null)
  for (const o of t.split(',')) n[o] = 1
  return (o) => o in n
}
const EMPTY_OBJ = {},
  EMPTY_ARR = [],
  NOOP = () => {},
  NO = () => !1,
  isOn = (t) =>
    t.charCodeAt(0) === 111 &&
    t.charCodeAt(1) === 110 &&
    (t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97),
  isModelListener = (t) => t.startsWith('onUpdate:'),
  extend = Object.assign,
  remove = (t, n) => {
    const o = t.indexOf(n)
    o > -1 && t.splice(o, 1)
  },
  hasOwnProperty$1 = Object.prototype.hasOwnProperty,
  hasOwn = (t, n) => hasOwnProperty$1.call(t, n),
  isArray$1 = Array.isArray,
  isMap = (t) => toTypeString(t) === '[object Map]',
  isSet = (t) => toTypeString(t) === '[object Set]',
  isDate = (t) => toTypeString(t) === '[object Date]',
  isRegExp = (t) => toTypeString(t) === '[object RegExp]',
  isFunction = (t) => typeof t == 'function',
  isString = (t) => typeof t == 'string',
  isSymbol = (t) => typeof t == 'symbol',
  isObject = (t) => t !== null && typeof t == 'object',
  isPromise = (t) => (isObject(t) || isFunction(t)) && isFunction(t.then) && isFunction(t.catch),
  objectToString = Object.prototype.toString,
  toTypeString = (t) => objectToString.call(t),
  toRawType = (t) => toTypeString(t).slice(8, -1),
  isPlainObject$1 = (t) => toTypeString(t) === '[object Object]',
  isIntegerKey = (t) => isString(t) && t !== 'NaN' && t[0] !== '-' && '' + parseInt(t, 10) === t,
  isReservedProp = makeMap(
    ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted',
  ),
  cacheStringFunction = (t) => {
    const n = Object.create(null)
    return (o) => n[o] || (n[o] = t(o))
  },
  camelizeRE = /-(\w)/g,
  camelize = cacheStringFunction((t) =>
    t.replace(camelizeRE, (n, o) => (o ? o.toUpperCase() : '')),
  ),
  hyphenateRE = /\B([A-Z])/g,
  hyphenate = cacheStringFunction((t) => t.replace(hyphenateRE, '-$1').toLowerCase()),
  capitalize = cacheStringFunction((t) => t.charAt(0).toUpperCase() + t.slice(1)),
  toHandlerKey = cacheStringFunction((t) => (t ? `on${capitalize(t)}` : '')),
  hasChanged = (t, n) => !Object.is(t, n),
  invokeArrayFns = (t, ...n) => {
    for (let o = 0; o < t.length; o++) t[o](...n)
  },
  def = (t, n, o, s = !1) => {
    Object.defineProperty(t, n, { configurable: !0, enumerable: !1, writable: s, value: o })
  },
  looseToNumber = (t) => {
    const n = parseFloat(t)
    return isNaN(n) ? t : n
  },
  toNumber = (t) => {
    const n = isString(t) ? Number(t) : NaN
    return isNaN(n) ? t : n
  }
let _globalThis
const getGlobalThis = () =>
    _globalThis ||
    (_globalThis =
      typeof globalThis < 'u'
        ? globalThis
        : typeof self < 'u'
          ? self
          : typeof window < 'u'
            ? window
            : typeof global < 'u'
              ? global
              : {}),
  GLOBALS_ALLOWED =
    'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol',
  isGloballyAllowed = makeMap(GLOBALS_ALLOWED)
function normalizeStyle(t) {
  if (isArray$1(t)) {
    const n = {}
    for (let o = 0; o < t.length; o++) {
      const s = t[o],
        r = isString(s) ? parseStringStyle(s) : normalizeStyle(s)
      if (r) for (const i in r) n[i] = r[i]
    }
    return n
  } else if (isString(t) || isObject(t)) return t
}
const listDelimiterRE = /;(?![^(]*\))/g,
  propertyDelimiterRE = /:([^]+)/,
  styleCommentRE = /\/\*[^]*?\*\//g
function parseStringStyle(t) {
  const n = {}
  return (
    t
      .replace(styleCommentRE, '')
      .split(listDelimiterRE)
      .forEach((o) => {
        if (o) {
          const s = o.split(propertyDelimiterRE)
          s.length > 1 && (n[s[0].trim()] = s[1].trim())
        }
      }),
    n
  )
}
function normalizeClass(t) {
  let n = ''
  if (isString(t)) n = t
  else if (isArray$1(t))
    for (let o = 0; o < t.length; o++) {
      const s = normalizeClass(t[o])
      s && (n += s + ' ')
    }
  else if (isObject(t)) for (const o in t) t[o] && (n += o + ' ')
  return n.trim()
}
function normalizeProps(t) {
  if (!t) return null
  let { class: n, style: o } = t
  return n && !isString(n) && (t.class = normalizeClass(n)), o && (t.style = normalizeStyle(o)), t
}
const specialBooleanAttrs =
    'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly',
  isSpecialBooleanAttr = makeMap(specialBooleanAttrs)
function includeBooleanAttr(t) {
  return !!t || t === ''
}
function looseCompareArrays(t, n) {
  if (t.length !== n.length) return !1
  let o = !0
  for (let s = 0; o && s < t.length; s++) o = looseEqual(t[s], n[s])
  return o
}
function looseEqual(t, n) {
  if (t === n) return !0
  let o = isDate(t),
    s = isDate(n)
  if (o || s) return o && s ? t.getTime() === n.getTime() : !1
  if (((o = isSymbol(t)), (s = isSymbol(n)), o || s)) return t === n
  if (((o = isArray$1(t)), (s = isArray$1(n)), o || s))
    return o && s ? looseCompareArrays(t, n) : !1
  if (((o = isObject(t)), (s = isObject(n)), o || s)) {
    if (!o || !s) return !1
    const r = Object.keys(t).length,
      i = Object.keys(n).length
    if (r !== i) return !1
    for (const a in t) {
      const c = t.hasOwnProperty(a),
        u = n.hasOwnProperty(a)
      if ((c && !u) || (!c && u) || !looseEqual(t[a], n[a])) return !1
    }
  }
  return String(t) === String(n)
}
function looseIndexOf(t, n) {
  return t.findIndex((o) => looseEqual(o, n))
}
const isRef$1 = (t) => !!(t && t.__v_isRef === !0),
  toDisplayString = (t) =>
    isString(t)
      ? t
      : t == null
        ? ''
        : isArray$1(t) ||
            (isObject(t) && (t.toString === objectToString || !isFunction(t.toString)))
          ? isRef$1(t)
            ? toDisplayString(t.value)
            : JSON.stringify(t, replacer, 2)
          : String(t),
  replacer = (t, n) =>
    isRef$1(n)
      ? replacer(t, n.value)
      : isMap(n)
        ? {
            [`Map(${n.size})`]: [...n.entries()].reduce(
              (o, [s, r], i) => ((o[stringifySymbol(s, i) + ' =>'] = r), o),
              {},
            ),
          }
        : isSet(n)
          ? { [`Set(${n.size})`]: [...n.values()].map((o) => stringifySymbol(o)) }
          : isSymbol(n)
            ? stringifySymbol(n)
            : isObject(n) && !isArray$1(n) && !isPlainObject$1(n)
              ? String(n)
              : n,
  stringifySymbol = (t, n = '') => {
    var o
    return isSymbol(t) ? `Symbol(${(o = t.description) != null ? o : n})` : t
  }
/**
 * @vue/reactivity v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let activeEffectScope
class EffectScope {
  constructor(n = !1) {
    ;(this.detached = n),
      (this._active = !0),
      (this._on = 0),
      (this.effects = []),
      (this.cleanups = []),
      (this._isPaused = !1),
      (this.parent = activeEffectScope),
      !n &&
        activeEffectScope &&
        (this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1)
  }
  get active() {
    return this._active
  }
  pause() {
    if (this._active) {
      this._isPaused = !0
      let n, o
      if (this.scopes) for (n = 0, o = this.scopes.length; n < o; n++) this.scopes[n].pause()
      for (n = 0, o = this.effects.length; n < o; n++) this.effects[n].pause()
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1
      let n, o
      if (this.scopes) for (n = 0, o = this.scopes.length; n < o; n++) this.scopes[n].resume()
      for (n = 0, o = this.effects.length; n < o; n++) this.effects[n].resume()
    }
  }
  run(n) {
    if (this._active) {
      const o = activeEffectScope
      try {
        return (activeEffectScope = this), n()
      } finally {
        activeEffectScope = o
      }
    }
  }
  on() {
    ++this._on === 1 && ((this.prevScope = activeEffectScope), (activeEffectScope = this))
  }
  off() {
    this._on > 0 &&
      --this._on === 0 &&
      ((activeEffectScope = this.prevScope), (this.prevScope = void 0))
  }
  stop(n) {
    if (this._active) {
      this._active = !1
      let o, s
      for (o = 0, s = this.effects.length; o < s; o++) this.effects[o].stop()
      for (this.effects.length = 0, o = 0, s = this.cleanups.length; o < s; o++) this.cleanups[o]()
      if (((this.cleanups.length = 0), this.scopes)) {
        for (o = 0, s = this.scopes.length; o < s; o++) this.scopes[o].stop(!0)
        this.scopes.length = 0
      }
      if (!this.detached && this.parent && !n) {
        const r = this.parent.scopes.pop()
        r && r !== this && ((this.parent.scopes[this.index] = r), (r.index = this.index))
      }
      this.parent = void 0
    }
  }
}
function effectScope(t) {
  return new EffectScope(t)
}
function getCurrentScope() {
  return activeEffectScope
}
function onScopeDispose(t, n = !1) {
  activeEffectScope && activeEffectScope.cleanups.push(t)
}
let activeSub
const pausedQueueEffects = new WeakSet()
class ReactiveEffect {
  constructor(n) {
    ;(this.fn = n),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 5),
      (this.next = void 0),
      (this.cleanup = void 0),
      (this.scheduler = void 0),
      activeEffectScope && activeEffectScope.active && activeEffectScope.effects.push(this)
  }
  pause() {
    this.flags |= 64
  }
  resume() {
    this.flags & 64 &&
      ((this.flags &= -65),
      pausedQueueEffects.has(this) && (pausedQueueEffects.delete(this), this.trigger()))
  }
  notify() {
    ;(this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || batch(this)
  }
  run() {
    if (!(this.flags & 1)) return this.fn()
    ;(this.flags |= 2), cleanupEffect(this), prepareDeps(this)
    const n = activeSub,
      o = shouldTrack
    ;(activeSub = this), (shouldTrack = !0)
    try {
      return this.fn()
    } finally {
      cleanupDeps(this), (activeSub = n), (shouldTrack = o), (this.flags &= -3)
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let n = this.deps; n; n = n.nextDep) removeSub(n)
      ;(this.deps = this.depsTail = void 0),
        cleanupEffect(this),
        this.onStop && this.onStop(),
        (this.flags &= -2)
    }
  }
  trigger() {
    this.flags & 64
      ? pausedQueueEffects.add(this)
      : this.scheduler
        ? this.scheduler()
        : this.runIfDirty()
  }
  runIfDirty() {
    isDirty(this) && this.run()
  }
  get dirty() {
    return isDirty(this)
  }
}
let batchDepth = 0,
  batchedSub,
  batchedComputed
function batch(t, n = !1) {
  if (((t.flags |= 8), n)) {
    ;(t.next = batchedComputed), (batchedComputed = t)
    return
  }
  ;(t.next = batchedSub), (batchedSub = t)
}
function startBatch() {
  batchDepth++
}
function endBatch() {
  if (--batchDepth > 0) return
  if (batchedComputed) {
    let n = batchedComputed
    for (batchedComputed = void 0; n; ) {
      const o = n.next
      ;(n.next = void 0), (n.flags &= -9), (n = o)
    }
  }
  let t
  for (; batchedSub; ) {
    let n = batchedSub
    for (batchedSub = void 0; n; ) {
      const o = n.next
      if (((n.next = void 0), (n.flags &= -9), n.flags & 1))
        try {
          n.trigger()
        } catch (s) {
          t || (t = s)
        }
      n = o
    }
  }
  if (t) throw t
}
function prepareDeps(t) {
  for (let n = t.deps; n; n = n.nextDep)
    (n.version = -1), (n.prevActiveLink = n.dep.activeLink), (n.dep.activeLink = n)
}
function cleanupDeps(t) {
  let n,
    o = t.depsTail,
    s = o
  for (; s; ) {
    const r = s.prevDep
    s.version === -1 ? (s === o && (o = r), removeSub(s), removeDep(s)) : (n = s),
      (s.dep.activeLink = s.prevActiveLink),
      (s.prevActiveLink = void 0),
      (s = r)
  }
  ;(t.deps = n), (t.depsTail = o)
}
function isDirty(t) {
  for (let n = t.deps; n; n = n.nextDep)
    if (
      n.dep.version !== n.version ||
      (n.dep.computed && (refreshComputed(n.dep.computed) || n.dep.version !== n.version))
    )
      return !0
  return !!t._dirty
}
function refreshComputed(t) {
  if (
    (t.flags & 4 && !(t.flags & 16)) ||
    ((t.flags &= -17), t.globalVersion === globalVersion) ||
    ((t.globalVersion = globalVersion),
    !t.isSSR && t.flags & 128 && ((!t.deps && !t._dirty) || !isDirty(t)))
  )
    return
  t.flags |= 2
  const n = t.dep,
    o = activeSub,
    s = shouldTrack
  ;(activeSub = t), (shouldTrack = !0)
  try {
    prepareDeps(t)
    const r = t.fn(t._value)
    ;(n.version === 0 || hasChanged(r, t._value)) && ((t.flags |= 128), (t._value = r), n.version++)
  } catch (r) {
    throw (n.version++, r)
  } finally {
    ;(activeSub = o), (shouldTrack = s), cleanupDeps(t), (t.flags &= -3)
  }
}
function removeSub(t, n = !1) {
  const { dep: o, prevSub: s, nextSub: r } = t
  if (
    (s && ((s.nextSub = r), (t.prevSub = void 0)),
    r && ((r.prevSub = s), (t.nextSub = void 0)),
    o.subs === t && ((o.subs = s), !s && o.computed))
  ) {
    o.computed.flags &= -5
    for (let i = o.computed.deps; i; i = i.nextDep) removeSub(i, !0)
  }
  !n && !--o.sc && o.map && o.map.delete(o.key)
}
function removeDep(t) {
  const { prevDep: n, nextDep: o } = t
  n && ((n.nextDep = o), (t.prevDep = void 0)), o && ((o.prevDep = n), (t.nextDep = void 0))
}
function effect(t, n) {
  t.effect instanceof ReactiveEffect && (t = t.effect.fn)
  const o = new ReactiveEffect(t)
  n && extend(o, n)
  try {
    o.run()
  } catch (r) {
    throw (o.stop(), r)
  }
  const s = o.run.bind(o)
  return (s.effect = o), s
}
function stop(t) {
  t.effect.stop()
}
let shouldTrack = !0
const trackStack = []
function pauseTracking() {
  trackStack.push(shouldTrack), (shouldTrack = !1)
}
function resetTracking() {
  const t = trackStack.pop()
  shouldTrack = t === void 0 ? !0 : t
}
function cleanupEffect(t) {
  const { cleanup: n } = t
  if (((t.cleanup = void 0), n)) {
    const o = activeSub
    activeSub = void 0
    try {
      n()
    } finally {
      activeSub = o
    }
  }
}
let globalVersion = 0
class Link {
  constructor(n, o) {
    ;(this.sub = n),
      (this.dep = o),
      (this.version = o.version),
      (this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0)
  }
}
class Dep {
  constructor(n) {
    ;(this.computed = n),
      (this.version = 0),
      (this.activeLink = void 0),
      (this.subs = void 0),
      (this.map = void 0),
      (this.key = void 0),
      (this.sc = 0),
      (this.__v_skip = !0)
  }
  track(n) {
    if (!activeSub || !shouldTrack || activeSub === this.computed) return
    let o = this.activeLink
    if (o === void 0 || o.sub !== activeSub)
      (o = this.activeLink = new Link(activeSub, this)),
        activeSub.deps
          ? ((o.prevDep = activeSub.depsTail),
            (activeSub.depsTail.nextDep = o),
            (activeSub.depsTail = o))
          : (activeSub.deps = activeSub.depsTail = o),
        addSub(o)
    else if (o.version === -1 && ((o.version = this.version), o.nextDep)) {
      const s = o.nextDep
      ;(s.prevDep = o.prevDep),
        o.prevDep && (o.prevDep.nextDep = s),
        (o.prevDep = activeSub.depsTail),
        (o.nextDep = void 0),
        (activeSub.depsTail.nextDep = o),
        (activeSub.depsTail = o),
        activeSub.deps === o && (activeSub.deps = s)
    }
    return o
  }
  trigger(n) {
    this.version++, globalVersion++, this.notify(n)
  }
  notify(n) {
    startBatch()
    try {
      for (let o = this.subs; o; o = o.prevSub) o.sub.notify() && o.sub.dep.notify()
    } finally {
      endBatch()
    }
  }
}
function addSub(t) {
  if ((t.dep.sc++, t.sub.flags & 4)) {
    const n = t.dep.computed
    if (n && !t.dep.subs) {
      n.flags |= 20
      for (let s = n.deps; s; s = s.nextDep) addSub(s)
    }
    const o = t.dep.subs
    o !== t && ((t.prevSub = o), o && (o.nextSub = t)), (t.dep.subs = t)
  }
}
const targetMap = new WeakMap(),
  ITERATE_KEY = Symbol(''),
  MAP_KEY_ITERATE_KEY = Symbol(''),
  ARRAY_ITERATE_KEY = Symbol('')
function track(t, n, o) {
  if (shouldTrack && activeSub) {
    let s = targetMap.get(t)
    s || targetMap.set(t, (s = new Map()))
    let r = s.get(o)
    r || (s.set(o, (r = new Dep())), (r.map = s), (r.key = o)), r.track()
  }
}
function trigger(t, n, o, s, r, i) {
  const a = targetMap.get(t)
  if (!a) {
    globalVersion++
    return
  }
  const c = (u) => {
    u && u.trigger()
  }
  if ((startBatch(), n === 'clear')) a.forEach(c)
  else {
    const u = isArray$1(t),
      g = u && isIntegerKey(o)
    if (u && o === 'length') {
      const d = Number(s)
      a.forEach((v, y) => {
        ;(y === 'length' || y === ARRAY_ITERATE_KEY || (!isSymbol(y) && y >= d)) && c(v)
      })
    } else
      switch (
        ((o !== void 0 || a.has(void 0)) && c(a.get(o)), g && c(a.get(ARRAY_ITERATE_KEY)), n)
      ) {
        case 'add':
          u
            ? g && c(a.get('length'))
            : (c(a.get(ITERATE_KEY)), isMap(t) && c(a.get(MAP_KEY_ITERATE_KEY)))
          break
        case 'delete':
          u || (c(a.get(ITERATE_KEY)), isMap(t) && c(a.get(MAP_KEY_ITERATE_KEY)))
          break
        case 'set':
          isMap(t) && c(a.get(ITERATE_KEY))
          break
      }
  }
  endBatch()
}
function getDepFromReactive(t, n) {
  const o = targetMap.get(t)
  return o && o.get(n)
}
function reactiveReadArray(t) {
  const n = toRaw(t)
  return n === t
    ? n
    : (track(n, 'iterate', ARRAY_ITERATE_KEY), isShallow(t) ? n : n.map(toReactive))
}
function shallowReadArray(t) {
  return track((t = toRaw(t)), 'iterate', ARRAY_ITERATE_KEY), t
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, toReactive)
  },
  concat(...t) {
    return reactiveReadArray(this).concat(
      ...t.map((n) => (isArray$1(n) ? reactiveReadArray(n) : n)),
    )
  },
  entries() {
    return iterator(this, 'entries', (t) => ((t[1] = toReactive(t[1])), t))
  },
  every(t, n) {
    return apply(this, 'every', t, n, void 0, arguments)
  },
  filter(t, n) {
    return apply(this, 'filter', t, n, (o) => o.map(toReactive), arguments)
  },
  find(t, n) {
    return apply(this, 'find', t, n, toReactive, arguments)
  },
  findIndex(t, n) {
    return apply(this, 'findIndex', t, n, void 0, arguments)
  },
  findLast(t, n) {
    return apply(this, 'findLast', t, n, toReactive, arguments)
  },
  findLastIndex(t, n) {
    return apply(this, 'findLastIndex', t, n, void 0, arguments)
  },
  forEach(t, n) {
    return apply(this, 'forEach', t, n, void 0, arguments)
  },
  includes(...t) {
    return searchProxy(this, 'includes', t)
  },
  indexOf(...t) {
    return searchProxy(this, 'indexOf', t)
  },
  join(t) {
    return reactiveReadArray(this).join(t)
  },
  lastIndexOf(...t) {
    return searchProxy(this, 'lastIndexOf', t)
  },
  map(t, n) {
    return apply(this, 'map', t, n, void 0, arguments)
  },
  pop() {
    return noTracking(this, 'pop')
  },
  push(...t) {
    return noTracking(this, 'push', t)
  },
  reduce(t, ...n) {
    return reduce(this, 'reduce', t, n)
  },
  reduceRight(t, ...n) {
    return reduce(this, 'reduceRight', t, n)
  },
  shift() {
    return noTracking(this, 'shift')
  },
  some(t, n) {
    return apply(this, 'some', t, n, void 0, arguments)
  },
  splice(...t) {
    return noTracking(this, 'splice', t)
  },
  toReversed() {
    return reactiveReadArray(this).toReversed()
  },
  toSorted(t) {
    return reactiveReadArray(this).toSorted(t)
  },
  toSpliced(...t) {
    return reactiveReadArray(this).toSpliced(...t)
  },
  unshift(...t) {
    return noTracking(this, 'unshift', t)
  },
  values() {
    return iterator(this, 'values', toReactive)
  },
}
function iterator(t, n, o) {
  const s = shallowReadArray(t),
    r = s[n]()
  return (
    s !== t &&
      !isShallow(t) &&
      ((r._next = r.next),
      (r.next = () => {
        const i = r._next()
        return i.value && (i.value = o(i.value)), i
      })),
    r
  )
}
const arrayProto = Array.prototype
function apply(t, n, o, s, r, i) {
  const a = shallowReadArray(t),
    c = a !== t && !isShallow(t),
    u = a[n]
  if (u !== arrayProto[n]) {
    const v = u.apply(t, i)
    return c ? toReactive(v) : v
  }
  let g = o
  a !== t &&
    (c
      ? (g = function (v, y) {
          return o.call(this, toReactive(v), y, t)
        })
      : o.length > 2 &&
        (g = function (v, y) {
          return o.call(this, v, y, t)
        }))
  const d = u.call(a, g, s)
  return c && r ? r(d) : d
}
function reduce(t, n, o, s) {
  const r = shallowReadArray(t)
  let i = o
  return (
    r !== t &&
      (isShallow(t)
        ? o.length > 3 &&
          (i = function (a, c, u) {
            return o.call(this, a, c, u, t)
          })
        : (i = function (a, c, u) {
            return o.call(this, a, toReactive(c), u, t)
          })),
    r[n](i, ...s)
  )
}
function searchProxy(t, n, o) {
  const s = toRaw(t)
  track(s, 'iterate', ARRAY_ITERATE_KEY)
  const r = s[n](...o)
  return (r === -1 || r === !1) && isProxy(o[0]) ? ((o[0] = toRaw(o[0])), s[n](...o)) : r
}
function noTracking(t, n, o = []) {
  pauseTracking(), startBatch()
  const s = toRaw(t)[n].apply(t, o)
  return endBatch(), resetTracking(), s
}
const isNonTrackableKeys = makeMap('__proto__,__v_isRef,__isVue'),
  builtInSymbols = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter((t) => t !== 'arguments' && t !== 'caller')
      .map((t) => Symbol[t])
      .filter(isSymbol),
  )
function hasOwnProperty(t) {
  isSymbol(t) || (t = String(t))
  const n = toRaw(this)
  return track(n, 'has', t), n.hasOwnProperty(t)
}
class BaseReactiveHandler {
  constructor(n = !1, o = !1) {
    ;(this._isReadonly = n), (this._isShallow = o)
  }
  get(n, o, s) {
    if (o === '__v_skip') return n.__v_skip
    const r = this._isReadonly,
      i = this._isShallow
    if (o === '__v_isReactive') return !r
    if (o === '__v_isReadonly') return r
    if (o === '__v_isShallow') return i
    if (o === '__v_raw')
      return s ===
        (r ? (i ? shallowReadonlyMap : readonlyMap) : i ? shallowReactiveMap : reactiveMap).get(
          n,
        ) || Object.getPrototypeOf(n) === Object.getPrototypeOf(s)
        ? n
        : void 0
    const a = isArray$1(n)
    if (!r) {
      let u
      if (a && (u = arrayInstrumentations[o])) return u
      if (o === 'hasOwnProperty') return hasOwnProperty
    }
    const c = Reflect.get(n, o, isRef(n) ? n : s)
    return (isSymbol(o) ? builtInSymbols.has(o) : isNonTrackableKeys(o)) ||
      (r || track(n, 'get', o), i)
      ? c
      : isRef(c)
        ? a && isIntegerKey(o)
          ? c
          : c.value
        : isObject(c)
          ? r
            ? readonly(c)
            : reactive(c)
          : c
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(n = !1) {
    super(!1, n)
  }
  set(n, o, s, r) {
    let i = n[o]
    if (!this._isShallow) {
      const u = isReadonly(i)
      if (
        (!isShallow(s) && !isReadonly(s) && ((i = toRaw(i)), (s = toRaw(s))),
        !isArray$1(n) && isRef(i) && !isRef(s))
      )
        return u ? !1 : ((i.value = s), !0)
    }
    const a = isArray$1(n) && isIntegerKey(o) ? Number(o) < n.length : hasOwn(n, o),
      c = Reflect.set(n, o, s, isRef(n) ? n : r)
    return (
      n === toRaw(r) && (a ? hasChanged(s, i) && trigger(n, 'set', o, s) : trigger(n, 'add', o, s)),
      c
    )
  }
  deleteProperty(n, o) {
    const s = hasOwn(n, o)
    n[o]
    const r = Reflect.deleteProperty(n, o)
    return r && s && trigger(n, 'delete', o, void 0), r
  }
  has(n, o) {
    const s = Reflect.has(n, o)
    return (!isSymbol(o) || !builtInSymbols.has(o)) && track(n, 'has', o), s
  }
  ownKeys(n) {
    return track(n, 'iterate', isArray$1(n) ? 'length' : ITERATE_KEY), Reflect.ownKeys(n)
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(n = !1) {
    super(!0, n)
  }
  set(n, o) {
    return !0
  }
  deleteProperty(n, o) {
    return !0
  }
}
const mutableHandlers = new MutableReactiveHandler(),
  readonlyHandlers = new ReadonlyReactiveHandler(),
  shallowReactiveHandlers = new MutableReactiveHandler(!0),
  shallowReadonlyHandlers = new ReadonlyReactiveHandler(!0),
  toShallow = (t) => t,
  getProto = (t) => Reflect.getPrototypeOf(t)
function createIterableMethod(t, n, o) {
  return function (...s) {
    const r = this.__v_raw,
      i = toRaw(r),
      a = isMap(i),
      c = t === 'entries' || (t === Symbol.iterator && a),
      u = t === 'keys' && a,
      g = r[t](...s),
      d = o ? toShallow : n ? toReadonly : toReactive
    return (
      !n && track(i, 'iterate', u ? MAP_KEY_ITERATE_KEY : ITERATE_KEY),
      {
        next() {
          const { value: v, done: y } = g.next()
          return y ? { value: v, done: y } : { value: c ? [d(v[0]), d(v[1])] : d(v), done: y }
        },
        [Symbol.iterator]() {
          return this
        },
      }
    )
  }
}
function createReadonlyMethod(t) {
  return function (...n) {
    return t === 'delete' ? !1 : t === 'clear' ? void 0 : this
  }
}
function createInstrumentations(t, n) {
  const o = {
    get(r) {
      const i = this.__v_raw,
        a = toRaw(i),
        c = toRaw(r)
      t || (hasChanged(r, c) && track(a, 'get', r), track(a, 'get', c))
      const { has: u } = getProto(a),
        g = n ? toShallow : t ? toReadonly : toReactive
      if (u.call(a, r)) return g(i.get(r))
      if (u.call(a, c)) return g(i.get(c))
      i !== a && i.get(r)
    },
    get size() {
      const r = this.__v_raw
      return !t && track(toRaw(r), 'iterate', ITERATE_KEY), Reflect.get(r, 'size', r)
    },
    has(r) {
      const i = this.__v_raw,
        a = toRaw(i),
        c = toRaw(r)
      return (
        t || (hasChanged(r, c) && track(a, 'has', r), track(a, 'has', c)),
        r === c ? i.has(r) : i.has(r) || i.has(c)
      )
    },
    forEach(r, i) {
      const a = this,
        c = a.__v_raw,
        u = toRaw(c),
        g = n ? toShallow : t ? toReadonly : toReactive
      return !t && track(u, 'iterate', ITERATE_KEY), c.forEach((d, v) => r.call(i, g(d), g(v), a))
    },
  }
  return (
    extend(
      o,
      t
        ? {
            add: createReadonlyMethod('add'),
            set: createReadonlyMethod('set'),
            delete: createReadonlyMethod('delete'),
            clear: createReadonlyMethod('clear'),
          }
        : {
            add(r) {
              !n && !isShallow(r) && !isReadonly(r) && (r = toRaw(r))
              const i = toRaw(this)
              return getProto(i).has.call(i, r) || (i.add(r), trigger(i, 'add', r, r)), this
            },
            set(r, i) {
              !n && !isShallow(i) && !isReadonly(i) && (i = toRaw(i))
              const a = toRaw(this),
                { has: c, get: u } = getProto(a)
              let g = c.call(a, r)
              g || ((r = toRaw(r)), (g = c.call(a, r)))
              const d = u.call(a, r)
              return (
                a.set(r, i),
                g ? hasChanged(i, d) && trigger(a, 'set', r, i) : trigger(a, 'add', r, i),
                this
              )
            },
            delete(r) {
              const i = toRaw(this),
                { has: a, get: c } = getProto(i)
              let u = a.call(i, r)
              u || ((r = toRaw(r)), (u = a.call(i, r))), c && c.call(i, r)
              const g = i.delete(r)
              return u && trigger(i, 'delete', r, void 0), g
            },
            clear() {
              const r = toRaw(this),
                i = r.size !== 0,
                a = r.clear()
              return i && trigger(r, 'clear', void 0, void 0), a
            },
          },
    ),
    ['keys', 'values', 'entries', Symbol.iterator].forEach((r) => {
      o[r] = createIterableMethod(r, t, n)
    }),
    o
  )
}
function createInstrumentationGetter(t, n) {
  const o = createInstrumentations(t, n)
  return (s, r, i) =>
    r === '__v_isReactive'
      ? !t
      : r === '__v_isReadonly'
        ? t
        : r === '__v_raw'
          ? s
          : Reflect.get(hasOwn(o, r) && r in s ? o : s, r, i)
}
const mutableCollectionHandlers = { get: createInstrumentationGetter(!1, !1) },
  shallowCollectionHandlers = { get: createInstrumentationGetter(!1, !0) },
  readonlyCollectionHandlers = { get: createInstrumentationGetter(!0, !1) },
  shallowReadonlyCollectionHandlers = { get: createInstrumentationGetter(!0, !0) },
  reactiveMap = new WeakMap(),
  shallowReactiveMap = new WeakMap(),
  readonlyMap = new WeakMap(),
  shallowReadonlyMap = new WeakMap()
function targetTypeMap(t) {
  switch (t) {
    case 'Object':
    case 'Array':
      return 1
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return 2
    default:
      return 0
  }
}
function getTargetType(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : targetTypeMap(toRawType(t))
}
function reactive(t) {
  return isReadonly(t)
    ? t
    : createReactiveObject(t, !1, mutableHandlers, mutableCollectionHandlers, reactiveMap)
}
function shallowReactive(t) {
  return createReactiveObject(
    t,
    !1,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap,
  )
}
function readonly(t) {
  return createReactiveObject(t, !0, readonlyHandlers, readonlyCollectionHandlers, readonlyMap)
}
function shallowReadonly(t) {
  return createReactiveObject(
    t,
    !0,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap,
  )
}
function createReactiveObject(t, n, o, s, r) {
  if (!isObject(t) || (t.__v_raw && !(n && t.__v_isReactive))) return t
  const i = getTargetType(t)
  if (i === 0) return t
  const a = r.get(t)
  if (a) return a
  const c = new Proxy(t, i === 2 ? s : o)
  return r.set(t, c), c
}
function isReactive(t) {
  return isReadonly(t) ? isReactive(t.__v_raw) : !!(t && t.__v_isReactive)
}
function isReadonly(t) {
  return !!(t && t.__v_isReadonly)
}
function isShallow(t) {
  return !!(t && t.__v_isShallow)
}
function isProxy(t) {
  return t ? !!t.__v_raw : !1
}
function toRaw(t) {
  const n = t && t.__v_raw
  return n ? toRaw(n) : t
}
function markRaw(t) {
  return !hasOwn(t, '__v_skip') && Object.isExtensible(t) && def(t, '__v_skip', !0), t
}
const toReactive = (t) => (isObject(t) ? reactive(t) : t),
  toReadonly = (t) => (isObject(t) ? readonly(t) : t)
function isRef(t) {
  return t ? t.__v_isRef === !0 : !1
}
function ref(t) {
  return createRef(t, !1)
}
function shallowRef(t) {
  return createRef(t, !0)
}
function createRef(t, n) {
  return isRef(t) ? t : new RefImpl(t, n)
}
class RefImpl {
  constructor(n, o) {
    ;(this.dep = new Dep()),
      (this.__v_isRef = !0),
      (this.__v_isShallow = !1),
      (this._rawValue = o ? n : toRaw(n)),
      (this._value = o ? n : toReactive(n)),
      (this.__v_isShallow = o)
  }
  get value() {
    return this.dep.track(), this._value
  }
  set value(n) {
    const o = this._rawValue,
      s = this.__v_isShallow || isShallow(n) || isReadonly(n)
    ;(n = s ? n : toRaw(n)),
      hasChanged(n, o) &&
        ((this._rawValue = n), (this._value = s ? n : toReactive(n)), this.dep.trigger())
  }
}
function triggerRef(t) {
  t.dep && t.dep.trigger()
}
function unref(t) {
  return isRef(t) ? t.value : t
}
function toValue(t) {
  return isFunction(t) ? t() : unref(t)
}
const shallowUnwrapHandlers = {
  get: (t, n, o) => (n === '__v_raw' ? t : unref(Reflect.get(t, n, o))),
  set: (t, n, o, s) => {
    const r = t[n]
    return isRef(r) && !isRef(o) ? ((r.value = o), !0) : Reflect.set(t, n, o, s)
  },
}
function proxyRefs(t) {
  return isReactive(t) ? t : new Proxy(t, shallowUnwrapHandlers)
}
class CustomRefImpl {
  constructor(n) {
    ;(this.__v_isRef = !0), (this._value = void 0)
    const o = (this.dep = new Dep()),
      { get: s, set: r } = n(o.track.bind(o), o.trigger.bind(o))
    ;(this._get = s), (this._set = r)
  }
  get value() {
    return (this._value = this._get())
  }
  set value(n) {
    this._set(n)
  }
}
function customRef(t) {
  return new CustomRefImpl(t)
}
function toRefs(t) {
  const n = isArray$1(t) ? new Array(t.length) : {}
  for (const o in t) n[o] = propertyToRef(t, o)
  return n
}
class ObjectRefImpl {
  constructor(n, o, s) {
    ;(this._object = n),
      (this._key = o),
      (this._defaultValue = s),
      (this.__v_isRef = !0),
      (this._value = void 0)
  }
  get value() {
    const n = this._object[this._key]
    return (this._value = n === void 0 ? this._defaultValue : n)
  }
  set value(n) {
    this._object[this._key] = n
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key)
  }
}
class GetterRefImpl {
  constructor(n) {
    ;(this._getter = n), (this.__v_isRef = !0), (this.__v_isReadonly = !0), (this._value = void 0)
  }
  get value() {
    return (this._value = this._getter())
  }
}
function toRef(t, n, o) {
  return isRef(t)
    ? t
    : isFunction(t)
      ? new GetterRefImpl(t)
      : isObject(t) && arguments.length > 1
        ? propertyToRef(t, n, o)
        : ref(t)
}
function propertyToRef(t, n, o) {
  const s = t[n]
  return isRef(s) ? s : new ObjectRefImpl(t, n, o)
}
class ComputedRefImpl {
  constructor(n, o, s) {
    ;(this.fn = n),
      (this.setter = o),
      (this._value = void 0),
      (this.dep = new Dep(this)),
      (this.__v_isRef = !0),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 16),
      (this.globalVersion = globalVersion - 1),
      (this.next = void 0),
      (this.effect = this),
      (this.__v_isReadonly = !o),
      (this.isSSR = s)
  }
  notify() {
    if (((this.flags |= 16), !(this.flags & 8) && activeSub !== this)) return batch(this, !0), !0
  }
  get value() {
    const n = this.dep.track()
    return refreshComputed(this), n && (n.version = this.dep.version), this._value
  }
  set value(n) {
    this.setter && this.setter(n)
  }
}
function computed$1(t, n, o = !1) {
  let s, r
  return isFunction(t) ? (s = t) : ((s = t.get), (r = t.set)), new ComputedRefImpl(s, r, o)
}
const TrackOpTypes = { GET: 'get', HAS: 'has', ITERATE: 'iterate' },
  TriggerOpTypes = { SET: 'set', ADD: 'add', DELETE: 'delete', CLEAR: 'clear' },
  INITIAL_WATCHER_VALUE = {},
  cleanupMap = new WeakMap()
let activeWatcher
function getCurrentWatcher() {
  return activeWatcher
}
function onWatcherCleanup(t, n = !1, o = activeWatcher) {
  if (o) {
    let s = cleanupMap.get(o)
    s || cleanupMap.set(o, (s = [])), s.push(t)
  }
}
function watch$1(t, n, o = EMPTY_OBJ) {
  const { immediate: s, deep: r, once: i, scheduler: a, augmentJob: c, call: u } = o,
    g = (P) => (r ? P : isShallow(P) || r === !1 || r === 0 ? traverse(P, 1) : traverse(P))
  let d,
    v,
    y,
    _,
    $ = !1,
    A = !1
  if (
    (isRef(t)
      ? ((v = () => t.value), ($ = isShallow(t)))
      : isReactive(t)
        ? ((v = () => g(t)), ($ = !0))
        : isArray$1(t)
          ? ((A = !0),
            ($ = t.some((P) => isReactive(P) || isShallow(P))),
            (v = () =>
              t.map((P) => {
                if (isRef(P)) return P.value
                if (isReactive(P)) return g(P)
                if (isFunction(P)) return u ? u(P, 2) : P()
              })))
          : isFunction(t)
            ? n
              ? (v = u ? () => u(t, 2) : t)
              : (v = () => {
                  if (y) {
                    pauseTracking()
                    try {
                      y()
                    } finally {
                      resetTracking()
                    }
                  }
                  const P = activeWatcher
                  activeWatcher = d
                  try {
                    return u ? u(t, 3, [_]) : t(_)
                  } finally {
                    activeWatcher = P
                  }
                })
            : (v = NOOP),
    n && r)
  ) {
    const P = v,
      F = r === !0 ? 1 / 0 : r
    v = () => traverse(P(), F)
  }
  const k = getCurrentScope(),
    O = () => {
      d.stop(), k && k.active && remove(k.effects, d)
    }
  if (i && n) {
    const P = n
    n = (...F) => {
      P(...F), O()
    }
  }
  let j = A ? new Array(t.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE
  const B = (P) => {
    if (!(!(d.flags & 1) || (!d.dirty && !P)))
      if (n) {
        const F = d.run()
        if (r || $ || (A ? F.some((Be, Se) => hasChanged(Be, j[Se])) : hasChanged(F, j))) {
          y && y()
          const Be = activeWatcher
          activeWatcher = d
          try {
            const Se = [
              F,
              j === INITIAL_WATCHER_VALUE ? void 0 : A && j[0] === INITIAL_WATCHER_VALUE ? [] : j,
              _,
            ]
            ;(j = F), u ? u(n, 3, Se) : n(...Se)
          } finally {
            activeWatcher = Be
          }
        }
      } else d.run()
  }
  return (
    c && c(B),
    (d = new ReactiveEffect(v)),
    (d.scheduler = a ? () => a(B, !1) : B),
    (_ = (P) => onWatcherCleanup(P, !1, d)),
    (y = d.onStop =
      () => {
        const P = cleanupMap.get(d)
        if (P) {
          if (u) u(P, 4)
          else for (const F of P) F()
          cleanupMap.delete(d)
        }
      }),
    n ? (s ? B(!0) : (j = d.run())) : a ? a(B.bind(null, !0), !0) : d.run(),
    (O.pause = d.pause.bind(d)),
    (O.resume = d.resume.bind(d)),
    (O.stop = O),
    O
  )
}
function traverse(t, n = 1 / 0, o) {
  if (n <= 0 || !isObject(t) || t.__v_skip || ((o = o || new Set()), o.has(t))) return t
  if ((o.add(t), n--, isRef(t))) traverse(t.value, n, o)
  else if (isArray$1(t)) for (let s = 0; s < t.length; s++) traverse(t[s], n, o)
  else if (isSet(t) || isMap(t))
    t.forEach((s) => {
      traverse(s, n, o)
    })
  else if (isPlainObject$1(t)) {
    for (const s in t) traverse(t[s], n, o)
    for (const s of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, s) && traverse(t[s], n, o)
  }
  return t
}
/**
 * @vue/runtime-core v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ const stack = []
function pushWarningContext(t) {
  stack.push(t)
}
function popWarningContext() {
  stack.pop()
}
let isWarning = !1
function warn$1(t, ...n) {
  if (isWarning) return
  ;(isWarning = !0), pauseTracking()
  const o = stack.length ? stack[stack.length - 1].component : null,
    s = o && o.appContext.config.warnHandler,
    r = getComponentTrace()
  if (s)
    callWithErrorHandling(s, o, 11, [
      t +
        n
          .map((i) => {
            var a, c
            return (c = (a = i.toString) == null ? void 0 : a.call(i)) != null
              ? c
              : JSON.stringify(i)
          })
          .join(''),
      o && o.proxy,
      r.map(({ vnode: i }) => `at <${formatComponentName(o, i.type)}>`).join(`
`),
      r,
    ])
  else {
    const i = [`[Vue warn]: ${t}`, ...n]
    r.length &&
      i.push(
        `
`,
        ...formatTrace(r),
      ),
      console.warn(...i)
  }
  resetTracking(), (isWarning = !1)
}
function getComponentTrace() {
  let t = stack[stack.length - 1]
  if (!t) return []
  const n = []
  for (; t; ) {
    const o = n[0]
    o && o.vnode === t ? o.recurseCount++ : n.push({ vnode: t, recurseCount: 0 })
    const s = t.component && t.component.parent
    t = s && s.vnode
  }
  return n
}
function formatTrace(t) {
  const n = []
  return (
    t.forEach((o, s) => {
      n.push(
        ...(s === 0
          ? []
          : [
              `
`,
            ]),
        ...formatTraceEntry(o),
      )
    }),
    n
  )
}
function formatTraceEntry({ vnode: t, recurseCount: n }) {
  const o = n > 0 ? `... (${n} recursive calls)` : '',
    s = t.component ? t.component.parent == null : !1,
    r = ` at <${formatComponentName(t.component, t.type, s)}`,
    i = '>' + o
  return t.props ? [r, ...formatProps(t.props), i] : [r + i]
}
function formatProps(t) {
  const n = [],
    o = Object.keys(t)
  return (
    o.slice(0, 3).forEach((s) => {
      n.push(...formatProp(s, t[s]))
    }),
    o.length > 3 && n.push(' ...'),
    n
  )
}
function formatProp(t, n, o) {
  return isString(n)
    ? ((n = JSON.stringify(n)), o ? n : [`${t}=${n}`])
    : typeof n == 'number' || typeof n == 'boolean' || n == null
      ? o
        ? n
        : [`${t}=${n}`]
      : isRef(n)
        ? ((n = formatProp(t, toRaw(n.value), !0)), o ? n : [`${t}=Ref<`, n, '>'])
        : isFunction(n)
          ? [`${t}=fn${n.name ? `<${n.name}>` : ''}`]
          : ((n = toRaw(n)), o ? n : [`${t}=`, n])
}
function assertNumber(t, n) {}
const ErrorCodes = {
    SETUP_FUNCTION: 0,
    0: 'SETUP_FUNCTION',
    RENDER_FUNCTION: 1,
    1: 'RENDER_FUNCTION',
    NATIVE_EVENT_HANDLER: 5,
    5: 'NATIVE_EVENT_HANDLER',
    COMPONENT_EVENT_HANDLER: 6,
    6: 'COMPONENT_EVENT_HANDLER',
    VNODE_HOOK: 7,
    7: 'VNODE_HOOK',
    DIRECTIVE_HOOK: 8,
    8: 'DIRECTIVE_HOOK',
    TRANSITION_HOOK: 9,
    9: 'TRANSITION_HOOK',
    APP_ERROR_HANDLER: 10,
    10: 'APP_ERROR_HANDLER',
    APP_WARN_HANDLER: 11,
    11: 'APP_WARN_HANDLER',
    FUNCTION_REF: 12,
    12: 'FUNCTION_REF',
    ASYNC_COMPONENT_LOADER: 13,
    13: 'ASYNC_COMPONENT_LOADER',
    SCHEDULER: 14,
    14: 'SCHEDULER',
    COMPONENT_UPDATE: 15,
    15: 'COMPONENT_UPDATE',
    APP_UNMOUNT_CLEANUP: 16,
    16: 'APP_UNMOUNT_CLEANUP',
  },
  ErrorTypeStrings$1 = {
    sp: 'serverPrefetch hook',
    bc: 'beforeCreate hook',
    c: 'created hook',
    bm: 'beforeMount hook',
    m: 'mounted hook',
    bu: 'beforeUpdate hook',
    u: 'updated',
    bum: 'beforeUnmount hook',
    um: 'unmounted hook',
    a: 'activated hook',
    da: 'deactivated hook',
    ec: 'errorCaptured hook',
    rtc: 'renderTracked hook',
    rtg: 'renderTriggered hook',
    0: 'setup function',
    1: 'render function',
    2: 'watcher getter',
    3: 'watcher callback',
    4: 'watcher cleanup function',
    5: 'native event handler',
    6: 'component event handler',
    7: 'vnode hook',
    8: 'directive hook',
    9: 'transition hook',
    10: 'app errorHandler',
    11: 'app warnHandler',
    12: 'ref function',
    13: 'async component loader',
    14: 'scheduler flush',
    15: 'component update',
    16: 'app unmount cleanup function',
  }
function callWithErrorHandling(t, n, o, s) {
  try {
    return s ? t(...s) : t()
  } catch (r) {
    handleError(r, n, o)
  }
}
function callWithAsyncErrorHandling(t, n, o, s) {
  if (isFunction(t)) {
    const r = callWithErrorHandling(t, n, o, s)
    return (
      r &&
        isPromise(r) &&
        r.catch((i) => {
          handleError(i, n, o)
        }),
      r
    )
  }
  if (isArray$1(t)) {
    const r = []
    for (let i = 0; i < t.length; i++) r.push(callWithAsyncErrorHandling(t[i], n, o, s))
    return r
  }
}
function handleError(t, n, o, s = !0) {
  const r = n ? n.vnode : null,
    { errorHandler: i, throwUnhandledErrorInProduction: a } =
      (n && n.appContext.config) || EMPTY_OBJ
  if (n) {
    let c = n.parent
    const u = n.proxy,
      g = `https://vuejs.org/error-reference/#runtime-${o}`
    for (; c; ) {
      const d = c.ec
      if (d) {
        for (let v = 0; v < d.length; v++) if (d[v](t, u, g) === !1) return
      }
      c = c.parent
    }
    if (i) {
      pauseTracking(), callWithErrorHandling(i, null, 10, [t, u, g]), resetTracking()
      return
    }
  }
  logError(t, o, r, s, a)
}
function logError(t, n, o, s = !0, r = !1) {
  if (r) throw t
  console.error(t)
}
const queue = []
let flushIndex = -1
const pendingPostFlushCbs = []
let activePostFlushCbs = null,
  postFlushIndex = 0
const resolvedPromise = Promise.resolve()
let currentFlushPromise = null
function nextTick(t) {
  const n = currentFlushPromise || resolvedPromise
  return t ? n.then(this ? t.bind(this) : t) : n
}
function findInsertionIndex$1(t) {
  let n = flushIndex + 1,
    o = queue.length
  for (; n < o; ) {
    const s = (n + o) >>> 1,
      r = queue[s],
      i = getId(r)
    i < t || (i === t && r.flags & 2) ? (n = s + 1) : (o = s)
  }
  return n
}
function queueJob(t) {
  if (!(t.flags & 1)) {
    const n = getId(t),
      o = queue[queue.length - 1]
    !o || (!(t.flags & 2) && n >= getId(o))
      ? queue.push(t)
      : queue.splice(findInsertionIndex$1(n), 0, t),
      (t.flags |= 1),
      queueFlush()
  }
}
function queueFlush() {
  currentFlushPromise || (currentFlushPromise = resolvedPromise.then(flushJobs))
}
function queuePostFlushCb(t) {
  isArray$1(t)
    ? pendingPostFlushCbs.push(...t)
    : activePostFlushCbs && t.id === -1
      ? activePostFlushCbs.splice(postFlushIndex + 1, 0, t)
      : t.flags & 1 || (pendingPostFlushCbs.push(t), (t.flags |= 1)),
    queueFlush()
}
function flushPreFlushCbs(t, n, o = flushIndex + 1) {
  for (; o < queue.length; o++) {
    const s = queue[o]
    if (s && s.flags & 2) {
      if (t && s.id !== t.uid) continue
      queue.splice(o, 1), o--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2)
    }
  }
}
function flushPostFlushCbs(t) {
  if (pendingPostFlushCbs.length) {
    const n = [...new Set(pendingPostFlushCbs)].sort((o, s) => getId(o) - getId(s))
    if (((pendingPostFlushCbs.length = 0), activePostFlushCbs)) {
      activePostFlushCbs.push(...n)
      return
    }
    for (
      activePostFlushCbs = n, postFlushIndex = 0;
      postFlushIndex < activePostFlushCbs.length;
      postFlushIndex++
    ) {
      const o = activePostFlushCbs[postFlushIndex]
      o.flags & 4 && (o.flags &= -2), o.flags & 8 || o(), (o.flags &= -2)
    }
    ;(activePostFlushCbs = null), (postFlushIndex = 0)
  }
}
const getId = (t) => (t.id == null ? (t.flags & 2 ? -1 : 1 / 0) : t.id)
function flushJobs(t) {
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const n = queue[flushIndex]
      n &&
        !(n.flags & 8) &&
        (n.flags & 4 && (n.flags &= -2),
        callWithErrorHandling(n, n.i, n.i ? 15 : 14),
        n.flags & 4 || (n.flags &= -2))
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const n = queue[flushIndex]
      n && (n.flags &= -2)
    }
    ;(flushIndex = -1),
      (queue.length = 0),
      flushPostFlushCbs(),
      (currentFlushPromise = null),
      (queue.length || pendingPostFlushCbs.length) && flushJobs()
  }
}
let devtools$1,
  buffer = []
function setDevtoolsHook$1(t, n) {
  var o, s
  ;(devtools$1 = t),
    devtools$1
      ? ((devtools$1.enabled = !0),
        buffer.forEach(({ event: r, args: i }) => devtools$1.emit(r, ...i)),
        (buffer = []))
      : typeof window < 'u' &&
          window.HTMLElement &&
          !(
            (s = (o = window.navigator) == null ? void 0 : o.userAgent) != null &&
            s.includes('jsdom')
          )
        ? ((n.__VUE_DEVTOOLS_HOOK_REPLAY__ = n.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((i) => {
            setDevtoolsHook$1(i, n)
          }),
          setTimeout(() => {
            devtools$1 || ((n.__VUE_DEVTOOLS_HOOK_REPLAY__ = null), (buffer = []))
          }, 3e3))
        : (buffer = [])
}
let currentRenderingInstance = null,
  currentScopeId = null
function setCurrentRenderingInstance(t) {
  const n = currentRenderingInstance
  return (currentRenderingInstance = t), (currentScopeId = (t && t.type.__scopeId) || null), n
}
function pushScopeId(t) {
  currentScopeId = t
}
function popScopeId() {
  currentScopeId = null
}
const withScopeId = (t) => withCtx
function withCtx(t, n = currentRenderingInstance, o) {
  if (!n || t._n) return t
  const s = (...r) => {
    s._d && setBlockTracking(-1)
    const i = setCurrentRenderingInstance(n)
    let a
    try {
      a = t(...r)
    } finally {
      setCurrentRenderingInstance(i), s._d && setBlockTracking(1)
    }
    return a
  }
  return (s._n = !0), (s._c = !0), (s._d = !0), s
}
function withDirectives(t, n) {
  if (currentRenderingInstance === null) return t
  const o = getComponentPublicInstance(currentRenderingInstance),
    s = t.dirs || (t.dirs = [])
  for (let r = 0; r < n.length; r++) {
    let [i, a, c, u = EMPTY_OBJ] = n[r]
    i &&
      (isFunction(i) && (i = { mounted: i, updated: i }),
      i.deep && traverse(a),
      s.push({ dir: i, instance: o, value: a, oldValue: void 0, arg: c, modifiers: u }))
  }
  return t
}
function invokeDirectiveHook(t, n, o, s) {
  const r = t.dirs,
    i = n && n.dirs
  for (let a = 0; a < r.length; a++) {
    const c = r[a]
    i && (c.oldValue = i[a].value)
    let u = c.dir[s]
    u && (pauseTracking(), callWithAsyncErrorHandling(u, o, 8, [t.el, c, t, n]), resetTracking())
  }
}
const TeleportEndKey = Symbol('_vte'),
  isTeleport = (t) => t.__isTeleport,
  isTeleportDisabled = (t) => t && (t.disabled || t.disabled === ''),
  isTeleportDeferred = (t) => t && (t.defer || t.defer === ''),
  isTargetSVG = (t) => typeof SVGElement < 'u' && t instanceof SVGElement,
  isTargetMathML = (t) => typeof MathMLElement == 'function' && t instanceof MathMLElement,
  resolveTarget = (t, n) => {
    const o = t && t.to
    return isString(o) ? (n ? n(o) : null) : o
  },
  TeleportImpl = {
    name: 'Teleport',
    __isTeleport: !0,
    process(t, n, o, s, r, i, a, c, u, g) {
      const {
          mc: d,
          pc: v,
          pbc: y,
          o: { insert: _, querySelector: $, createText: A, createComment: k },
        } = g,
        O = isTeleportDisabled(n.props)
      let { shapeFlag: j, children: B, dynamicChildren: P } = n
      if (t == null) {
        const F = (n.el = A('')),
          Be = (n.anchor = A(''))
        _(F, o, s), _(Be, o, s)
        const Se = (R, D) => {
            j & 16 && (r && r.isCE && (r.ce._teleportTarget = R), d(B, R, D, r, i, a, c, u))
          },
          L = () => {
            const R = (n.target = resolveTarget(n.props, $)),
              D = prepareAnchor(R, n, A, _)
            R &&
              (a !== 'svg' && isTargetSVG(R)
                ? (a = 'svg')
                : a !== 'mathml' && isTargetMathML(R) && (a = 'mathml'),
              O || (Se(R, D), updateCssVars(n, !1)))
          }
        O && (Se(o, Be), updateCssVars(n, !0)),
          isTeleportDeferred(n.props)
            ? ((n.el.__isMounted = !1),
              queuePostRenderEffect(() => {
                L(), delete n.el.__isMounted
              }, i))
            : L()
      } else {
        if (isTeleportDeferred(n.props) && t.el.__isMounted === !1) {
          queuePostRenderEffect(() => {
            TeleportImpl.process(t, n, o, s, r, i, a, c, u, g)
          }, i)
          return
        }
        ;(n.el = t.el), (n.targetStart = t.targetStart)
        const F = (n.anchor = t.anchor),
          Be = (n.target = t.target),
          Se = (n.targetAnchor = t.targetAnchor),
          L = isTeleportDisabled(t.props),
          R = L ? o : Be,
          D = L ? F : Se
        if (
          (a === 'svg' || isTargetSVG(Be)
            ? (a = 'svg')
            : (a === 'mathml' || isTargetMathML(Be)) && (a = 'mathml'),
          P
            ? (y(t.dynamicChildren, P, R, r, i, a, c), traverseStaticChildren(t, n, !0))
            : u || v(t, n, R, D, r, i, a, c, !1),
          O)
        )
          L
            ? n.props && t.props && n.props.to !== t.props.to && (n.props.to = t.props.to)
            : moveTeleport(n, o, F, g, 1)
        else if ((n.props && n.props.to) !== (t.props && t.props.to)) {
          const Te = (n.target = resolveTarget(n.props, $))
          Te && moveTeleport(n, Te, null, g, 0)
        } else L && moveTeleport(n, Be, Se, g, 1)
        updateCssVars(n, O)
      }
    },
    remove(t, n, o, { um: s, o: { remove: r } }, i) {
      const {
        shapeFlag: a,
        children: c,
        anchor: u,
        targetStart: g,
        targetAnchor: d,
        target: v,
        props: y,
      } = t
      if ((v && (r(g), r(d)), i && r(u), a & 16)) {
        const _ = i || !isTeleportDisabled(y)
        for (let $ = 0; $ < c.length; $++) {
          const A = c[$]
          s(A, n, o, _, !!A.dynamicChildren)
        }
      }
    },
    move: moveTeleport,
    hydrate: hydrateTeleport,
  }
function moveTeleport(t, n, o, { o: { insert: s }, m: r }, i = 2) {
  i === 0 && s(t.targetAnchor, n, o)
  const { el: a, anchor: c, shapeFlag: u, children: g, props: d } = t,
    v = i === 2
  if ((v && s(a, n, o), (!v || isTeleportDisabled(d)) && u & 16))
    for (let y = 0; y < g.length; y++) r(g[y], n, o, 2)
  v && s(c, n, o)
}
function hydrateTeleport(
  t,
  n,
  o,
  s,
  r,
  i,
  { o: { nextSibling: a, parentNode: c, querySelector: u, insert: g, createText: d } },
  v,
) {
  const y = (n.target = resolveTarget(n.props, u))
  if (y) {
    const _ = isTeleportDisabled(n.props),
      $ = y._lpa || y.firstChild
    if (n.shapeFlag & 16)
      if (_)
        (n.anchor = v(a(t), n, c(t), o, s, r, i)), (n.targetStart = $), (n.targetAnchor = $ && a($))
      else {
        n.anchor = a(t)
        let A = $
        for (; A; ) {
          if (A && A.nodeType === 8) {
            if (A.data === 'teleport start anchor') n.targetStart = A
            else if (A.data === 'teleport anchor') {
              ;(n.targetAnchor = A), (y._lpa = n.targetAnchor && a(n.targetAnchor))
              break
            }
          }
          A = a(A)
        }
        n.targetAnchor || prepareAnchor(y, n, d, g), v($ && a($), n, y, o, s, r, i)
      }
    updateCssVars(n, _)
  }
  return n.anchor && a(n.anchor)
}
const Teleport = TeleportImpl
function updateCssVars(t, n) {
  const o = t.ctx
  if (o && o.ut) {
    let s, r
    for (
      n ? ((s = t.el), (r = t.anchor)) : ((s = t.targetStart), (r = t.targetAnchor));
      s && s !== r;

    )
      s.nodeType === 1 && s.setAttribute('data-v-owner', o.uid), (s = s.nextSibling)
    o.ut()
  }
}
function prepareAnchor(t, n, o, s) {
  const r = (n.targetStart = o('')),
    i = (n.targetAnchor = o(''))
  return (r[TeleportEndKey] = i), t && (s(r, t), s(i, t)), i
}
const leaveCbKey = Symbol('_leaveCb'),
  enterCbKey$1 = Symbol('_enterCb')
function useTransitionState() {
  const t = { isMounted: !1, isLeaving: !1, isUnmounting: !1, leavingVNodes: new Map() }
  return (
    onMounted(() => {
      t.isMounted = !0
    }),
    onBeforeUnmount(() => {
      t.isUnmounting = !0
    }),
    t
  )
}
const TransitionHookValidator = [Function, Array],
  BaseTransitionPropsValidators = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator,
  },
  recursiveGetSubtree = (t) => {
    const n = t.subTree
    return n.component ? recursiveGetSubtree(n.component) : n
  },
  BaseTransitionImpl = {
    name: 'BaseTransition',
    props: BaseTransitionPropsValidators,
    setup(t, { slots: n }) {
      const o = getCurrentInstance(),
        s = useTransitionState()
      return () => {
        const r = n.default && getTransitionRawChildren(n.default(), !0)
        if (!r || !r.length) return
        const i = findNonCommentChild(r),
          a = toRaw(t),
          { mode: c } = a
        if (s.isLeaving) return emptyPlaceholder(i)
        const u = getInnerChild$1(i)
        if (!u) return emptyPlaceholder(i)
        let g = resolveTransitionHooks(u, a, s, o, (v) => (g = v))
        u.type !== Comment && setTransitionHooks(u, g)
        let d = o.subTree && getInnerChild$1(o.subTree)
        if (
          d &&
          d.type !== Comment &&
          !isSameVNodeType(u, d) &&
          recursiveGetSubtree(o).type !== Comment
        ) {
          let v = resolveTransitionHooks(d, a, s, o)
          if ((setTransitionHooks(d, v), c === 'out-in' && u.type !== Comment))
            return (
              (s.isLeaving = !0),
              (v.afterLeave = () => {
                ;(s.isLeaving = !1),
                  o.job.flags & 8 || o.update(),
                  delete v.afterLeave,
                  (d = void 0)
              }),
              emptyPlaceholder(i)
            )
          c === 'in-out' && u.type !== Comment
            ? (v.delayLeave = (y, _, $) => {
                const A = getLeavingNodesForType(s, d)
                ;(A[String(d.key)] = d),
                  (y[leaveCbKey] = () => {
                    _(), (y[leaveCbKey] = void 0), delete g.delayedLeave, (d = void 0)
                  }),
                  (g.delayedLeave = () => {
                    $(), delete g.delayedLeave, (d = void 0)
                  })
              })
            : (d = void 0)
        } else d && (d = void 0)
        return i
      }
    },
  }
function findNonCommentChild(t) {
  let n = t[0]
  if (t.length > 1) {
    for (const o of t)
      if (o.type !== Comment) {
        n = o
        break
      }
  }
  return n
}
const BaseTransition = BaseTransitionImpl
function getLeavingNodesForType(t, n) {
  const { leavingVNodes: o } = t
  let s = o.get(n.type)
  return s || ((s = Object.create(null)), o.set(n.type, s)), s
}
function resolveTransitionHooks(t, n, o, s, r) {
  const {
      appear: i,
      mode: a,
      persisted: c = !1,
      onBeforeEnter: u,
      onEnter: g,
      onAfterEnter: d,
      onEnterCancelled: v,
      onBeforeLeave: y,
      onLeave: _,
      onAfterLeave: $,
      onLeaveCancelled: A,
      onBeforeAppear: k,
      onAppear: O,
      onAfterAppear: j,
      onAppearCancelled: B,
    } = n,
    P = String(t.key),
    F = getLeavingNodesForType(o, t),
    Be = (R, D) => {
      R && callWithAsyncErrorHandling(R, s, 9, D)
    },
    Se = (R, D) => {
      const Te = D[1]
      Be(R, D), isArray$1(R) ? R.every((K) => K.length <= 1) && Te() : R.length <= 1 && Te()
    },
    L = {
      mode: a,
      persisted: c,
      beforeEnter(R) {
        let D = u
        if (!o.isMounted)
          if (i) D = k || u
          else return
        R[leaveCbKey] && R[leaveCbKey](!0)
        const Te = F[P]
        Te && isSameVNodeType(t, Te) && Te.el[leaveCbKey] && Te.el[leaveCbKey](), Be(D, [R])
      },
      enter(R) {
        let D = g,
          Te = d,
          K = v
        if (!o.isMounted)
          if (i) (D = O || g), (Te = j || d), (K = B || v)
          else return
        let De = !1
        const je = (R[enterCbKey$1] = (Pe) => {
          De ||
            ((De = !0),
            Pe ? Be(K, [R]) : Be(Te, [R]),
            L.delayedLeave && L.delayedLeave(),
            (R[enterCbKey$1] = void 0))
        })
        D ? Se(D, [R, je]) : je()
      },
      leave(R, D) {
        const Te = String(t.key)
        if ((R[enterCbKey$1] && R[enterCbKey$1](!0), o.isUnmounting)) return D()
        Be(y, [R])
        let K = !1
        const De = (R[leaveCbKey] = (je) => {
          K ||
            ((K = !0),
            D(),
            je ? Be(A, [R]) : Be($, [R]),
            (R[leaveCbKey] = void 0),
            F[Te] === t && delete F[Te])
        })
        ;(F[Te] = t), _ ? Se(_, [R, De]) : De()
      },
      clone(R) {
        const D = resolveTransitionHooks(R, n, o, s, r)
        return r && r(D), D
      },
    }
  return L
}
function emptyPlaceholder(t) {
  if (isKeepAlive(t)) return (t = cloneVNode(t)), (t.children = null), t
}
function getInnerChild$1(t) {
  if (!isKeepAlive(t)) return isTeleport(t.type) && t.children ? findNonCommentChild(t.children) : t
  if (t.component) return t.component.subTree
  const { shapeFlag: n, children: o } = t
  if (o) {
    if (n & 16) return o[0]
    if (n & 32 && isFunction(o.default)) return o.default()
  }
}
function setTransitionHooks(t, n) {
  t.shapeFlag & 6 && t.component
    ? ((t.transition = n), setTransitionHooks(t.component.subTree, n))
    : t.shapeFlag & 128
      ? ((t.ssContent.transition = n.clone(t.ssContent)),
        (t.ssFallback.transition = n.clone(t.ssFallback)))
      : (t.transition = n)
}
function getTransitionRawChildren(t, n = !1, o) {
  let s = [],
    r = 0
  for (let i = 0; i < t.length; i++) {
    let a = t[i]
    const c = o == null ? a.key : String(o) + String(a.key != null ? a.key : i)
    a.type === Fragment
      ? (a.patchFlag & 128 && r++, (s = s.concat(getTransitionRawChildren(a.children, n, c))))
      : (n || a.type !== Comment) && s.push(c != null ? cloneVNode(a, { key: c }) : a)
  }
  if (r > 1) for (let i = 0; i < s.length; i++) s[i].patchFlag = -2
  return s
}
/*! #__NO_SIDE_EFFECTS__ */ function defineComponent(t, n) {
  return isFunction(t) ? extend({ name: t.name }, n, { setup: t }) : t
}
function useId() {
  const t = getCurrentInstance()
  return t ? (t.appContext.config.idPrefix || 'v') + '-' + t.ids[0] + t.ids[1]++ : ''
}
function markAsyncBoundary(t) {
  t.ids = [t.ids[0] + t.ids[2]++ + '-', 0, 0]
}
function useTemplateRef(t) {
  const n = getCurrentInstance(),
    o = shallowRef(null)
  if (n) {
    const r = n.refs === EMPTY_OBJ ? (n.refs = {}) : n.refs
    Object.defineProperty(r, t, { enumerable: !0, get: () => o.value, set: (i) => (o.value = i) })
  }
  return o
}
function setRef(t, n, o, s, r = !1) {
  if (isArray$1(t)) {
    t.forEach(($, A) => setRef($, n && (isArray$1(n) ? n[A] : n), o, s, r))
    return
  }
  if (isAsyncWrapper(s) && !r) {
    s.shapeFlag & 512 &&
      s.type.__asyncResolved &&
      s.component.subTree.component &&
      setRef(t, n, o, s.component.subTree)
    return
  }
  const i = s.shapeFlag & 4 ? getComponentPublicInstance(s.component) : s.el,
    a = r ? null : i,
    { i: c, r: u } = t,
    g = n && n.r,
    d = c.refs === EMPTY_OBJ ? (c.refs = {}) : c.refs,
    v = c.setupState,
    y = toRaw(v),
    _ = v === EMPTY_OBJ ? () => !1 : ($) => hasOwn(y, $)
  if (
    (g != null &&
      g !== u &&
      (isString(g) ? ((d[g] = null), _(g) && (v[g] = null)) : isRef(g) && (g.value = null)),
    isFunction(u))
  )
    callWithErrorHandling(u, c, 12, [a, d])
  else {
    const $ = isString(u),
      A = isRef(u)
    if ($ || A) {
      const k = () => {
        if (t.f) {
          const O = $ ? (_(u) ? v[u] : d[u]) : u.value
          r
            ? isArray$1(O) && remove(O, i)
            : isArray$1(O)
              ? O.includes(i) || O.push(i)
              : $
                ? ((d[u] = [i]), _(u) && (v[u] = d[u]))
                : ((u.value = [i]), t.k && (d[t.k] = u.value))
        } else $ ? ((d[u] = a), _(u) && (v[u] = a)) : A && ((u.value = a), t.k && (d[t.k] = a))
      }
      a ? ((k.id = -1), queuePostRenderEffect(k, o)) : k()
    }
  }
}
let hasLoggedMismatchError = !1
const logMismatchError = () => {
    hasLoggedMismatchError ||
      (console.error('Hydration completed but contains mismatches.'), (hasLoggedMismatchError = !0))
  },
  isSVGContainer = (t) => t.namespaceURI.includes('svg') && t.tagName !== 'foreignObject',
  isMathMLContainer = (t) => t.namespaceURI.includes('MathML'),
  getContainerType = (t) => {
    if (t.nodeType === 1) {
      if (isSVGContainer(t)) return 'svg'
      if (isMathMLContainer(t)) return 'mathml'
    }
  },
  isComment = (t) => t.nodeType === 8
function createHydrationFunctions(t) {
  const {
      mt: n,
      p: o,
      o: {
        patchProp: s,
        createText: r,
        nextSibling: i,
        parentNode: a,
        remove: c,
        insert: u,
        createComment: g,
      },
    } = t,
    d = (B, P) => {
      if (!P.hasChildNodes()) {
        o(null, B, P), flushPostFlushCbs(), (P._vnode = B)
        return
      }
      v(P.firstChild, B, null, null, null), flushPostFlushCbs(), (P._vnode = B)
    },
    v = (B, P, F, Be, Se, L = !1) => {
      L = L || !!P.dynamicChildren
      const R = isComment(B) && B.data === '[',
        D = () => A(B, P, F, Be, Se, R),
        { type: Te, ref: K, shapeFlag: De, patchFlag: je } = P
      let Pe = B.nodeType
      ;(P.el = B), je === -2 && ((L = !1), (P.dynamicChildren = null))
      let xe = null
      switch (Te) {
        case Text:
          Pe !== 3
            ? P.children === ''
              ? (u((P.el = r('')), a(B), B), (xe = B))
              : (xe = D())
            : (B.data !== P.children && (logMismatchError(), (B.data = P.children)), (xe = i(B)))
          break
        case Comment:
          j(B)
            ? ((xe = i(B)), O((P.el = B.content.firstChild), B, F))
            : Pe !== 8 || R
              ? (xe = D())
              : (xe = i(B))
          break
        case Static:
          if ((R && ((B = i(B)), (Pe = B.nodeType)), Pe === 1 || Pe === 3)) {
            xe = B
            const Ze = !P.children.length
            for (let Ke = 0; Ke < P.staticCount; Ke++)
              Ze && (P.children += xe.nodeType === 1 ? xe.outerHTML : xe.data),
                Ke === P.staticCount - 1 && (P.anchor = xe),
                (xe = i(xe))
            return R ? i(xe) : xe
          } else D()
          break
        case Fragment:
          R ? (xe = $(B, P, F, Be, Se, L)) : (xe = D())
          break
        default:
          if (De & 1)
            (Pe !== 1 || P.type.toLowerCase() !== B.tagName.toLowerCase()) && !j(B)
              ? (xe = D())
              : (xe = y(B, P, F, Be, Se, L))
          else if (De & 6) {
            P.slotScopeIds = Se
            const Ze = a(B)
            if (
              (R
                ? (xe = k(B))
                : isComment(B) && B.data === 'teleport start'
                  ? (xe = k(B, B.data, 'teleport end'))
                  : (xe = i(B)),
              n(P, Ze, null, F, Be, getContainerType(Ze), L),
              isAsyncWrapper(P) && !P.type.__asyncResolved)
            ) {
              let Ke
              R
                ? ((Ke = createVNode(Fragment)),
                  (Ke.anchor = xe ? xe.previousSibling : Ze.lastChild))
                : (Ke = B.nodeType === 3 ? createTextVNode('') : createVNode('div')),
                (Ke.el = B),
                (P.component.subTree = Ke)
            }
          } else
            De & 64
              ? Pe !== 8
                ? (xe = D())
                : (xe = P.type.hydrate(B, P, F, Be, Se, L, t, _))
              : De & 128 && (xe = P.type.hydrate(B, P, F, Be, getContainerType(a(B)), Se, L, t, v))
      }
      return K != null && setRef(K, null, Be, P), xe
    },
    y = (B, P, F, Be, Se, L) => {
      L = L || !!P.dynamicChildren
      const { type: R, props: D, patchFlag: Te, shapeFlag: K, dirs: De, transition: je } = P,
        Pe = R === 'input' || R === 'option'
      if (Pe || Te !== -1) {
        De && invokeDirectiveHook(P, null, F, 'created')
        let xe = !1
        if (j(B)) {
          xe = needTransition(null, je) && F && F.vnode.props && F.vnode.props.appear
          const Ke = B.content.firstChild
          if (xe) {
            const rt = Ke.getAttribute('class')
            rt && (Ke.$cls = rt), je.beforeEnter(Ke)
          }
          O(Ke, B, F), (P.el = B = Ke)
        }
        if (K & 16 && !(D && (D.innerHTML || D.textContent))) {
          let Ke = _(B.firstChild, P, B, F, Be, Se, L)
          for (; Ke; ) {
            isMismatchAllowed(B, 1) || logMismatchError()
            const rt = Ke
            ;(Ke = Ke.nextSibling), c(rt)
          }
        } else if (K & 8) {
          let Ke = P.children
          Ke[0] ===
            `
` &&
            (B.tagName === 'PRE' || B.tagName === 'TEXTAREA') &&
            (Ke = Ke.slice(1)),
            B.textContent !== Ke &&
              (isMismatchAllowed(B, 0) || logMismatchError(), (B.textContent = P.children))
        }
        if (D) {
          if (Pe || !L || Te & 48) {
            const Ke = B.tagName.includes('-')
            for (const rt in D)
              ((Pe && (rt.endsWith('value') || rt === 'indeterminate')) ||
                (isOn(rt) && !isReservedProp(rt)) ||
                rt[0] === '.' ||
                Ke) &&
                s(B, rt, null, D[rt], void 0, F)
          } else if (D.onClick) s(B, 'onClick', null, D.onClick, void 0, F)
          else if (Te & 4 && isReactive(D.style)) for (const Ke in D.style) D.style[Ke]
        }
        let Ze
        ;(Ze = D && D.onVnodeBeforeMount) && invokeVNodeHook(Ze, F, P),
          De && invokeDirectiveHook(P, null, F, 'beforeMount'),
          ((Ze = D && D.onVnodeMounted) || De || xe) &&
            queueEffectWithSuspense(() => {
              Ze && invokeVNodeHook(Ze, F, P),
                xe && je.enter(B),
                De && invokeDirectiveHook(P, null, F, 'mounted')
            }, Be)
      }
      return B.nextSibling
    },
    _ = (B, P, F, Be, Se, L, R) => {
      R = R || !!P.dynamicChildren
      const D = P.children,
        Te = D.length
      for (let K = 0; K < Te; K++) {
        const De = R ? D[K] : (D[K] = normalizeVNode(D[K])),
          je = De.type === Text
        B
          ? (je &&
              !R &&
              K + 1 < Te &&
              normalizeVNode(D[K + 1]).type === Text &&
              (u(r(B.data.slice(De.children.length)), F, i(B)), (B.data = De.children)),
            (B = v(B, De, Be, Se, L, R)))
          : je && !De.children
            ? u((De.el = r('')), F)
            : (isMismatchAllowed(F, 1) || logMismatchError(),
              o(null, De, F, null, Be, Se, getContainerType(F), L))
      }
      return B
    },
    $ = (B, P, F, Be, Se, L) => {
      const { slotScopeIds: R } = P
      R && (Se = Se ? Se.concat(R) : R)
      const D = a(B),
        Te = _(i(B), P, D, F, Be, Se, L)
      return Te && isComment(Te) && Te.data === ']'
        ? i((P.anchor = Te))
        : (logMismatchError(), u((P.anchor = g(']')), D, Te), Te)
    },
    A = (B, P, F, Be, Se, L) => {
      if ((isMismatchAllowed(B.parentElement, 1) || logMismatchError(), (P.el = null), L)) {
        const Te = k(B)
        for (;;) {
          const K = i(B)
          if (K && K !== Te) c(K)
          else break
        }
      }
      const R = i(B),
        D = a(B)
      return (
        c(B),
        o(null, P, D, R, F, Be, getContainerType(D), Se),
        F && ((F.vnode.el = P.el), updateHOCHostEl(F, P.el)),
        R
      )
    },
    k = (B, P = '[', F = ']') => {
      let Be = 0
      for (; B; )
        if (((B = i(B)), B && isComment(B) && (B.data === P && Be++, B.data === F))) {
          if (Be === 0) return i(B)
          Be--
        }
      return B
    },
    O = (B, P, F) => {
      const Be = P.parentNode
      Be && Be.replaceChild(B, P)
      let Se = F
      for (; Se; ) Se.vnode.el === P && (Se.vnode.el = Se.subTree.el = B), (Se = Se.parent)
    },
    j = (B) => B.nodeType === 1 && B.tagName === 'TEMPLATE'
  return [d, v]
}
const allowMismatchAttr = 'data-allow-mismatch',
  MismatchTypeString = { 0: 'text', 1: 'children', 2: 'class', 3: 'style', 4: 'attribute' }
function isMismatchAllowed(t, n) {
  if (n === 0 || n === 1) for (; t && !t.hasAttribute(allowMismatchAttr); ) t = t.parentElement
  const o = t && t.getAttribute(allowMismatchAttr)
  if (o == null) return !1
  if (o === '') return !0
  {
    const s = o.split(',')
    return n === 0 && s.includes('children') ? !0 : s.includes(MismatchTypeString[n])
  }
}
const requestIdleCallback = getGlobalThis().requestIdleCallback || ((t) => setTimeout(t, 1)),
  cancelIdleCallback = getGlobalThis().cancelIdleCallback || ((t) => clearTimeout(t)),
  hydrateOnIdle =
    (t = 1e4) =>
    (n) => {
      const o = requestIdleCallback(n, { timeout: t })
      return () => cancelIdleCallback(o)
    }
function elementIsVisibleInViewport(t) {
  const { top: n, left: o, bottom: s, right: r } = t.getBoundingClientRect(),
    { innerHeight: i, innerWidth: a } = window
  return ((n > 0 && n < i) || (s > 0 && s < i)) && ((o > 0 && o < a) || (r > 0 && r < a))
}
const hydrateOnVisible = (t) => (n, o) => {
    const s = new IntersectionObserver((r) => {
      for (const i of r)
        if (i.isIntersecting) {
          s.disconnect(), n()
          break
        }
    }, t)
    return (
      o((r) => {
        if (r instanceof Element) {
          if (elementIsVisibleInViewport(r)) return n(), s.disconnect(), !1
          s.observe(r)
        }
      }),
      () => s.disconnect()
    )
  },
  hydrateOnMediaQuery = (t) => (n) => {
    if (t) {
      const o = matchMedia(t)
      if (o.matches) n()
      else
        return (
          o.addEventListener('change', n, { once: !0 }), () => o.removeEventListener('change', n)
        )
    }
  },
  hydrateOnInteraction =
    (t = []) =>
    (n, o) => {
      isString(t) && (t = [t])
      let s = !1
      const r = (a) => {
          s || ((s = !0), i(), n(), a.target.dispatchEvent(new a.constructor(a.type, a)))
        },
        i = () => {
          o((a) => {
            for (const c of t) a.removeEventListener(c, r)
          })
        }
      return (
        o((a) => {
          for (const c of t) a.addEventListener(c, r, { once: !0 })
        }),
        i
      )
    }
function forEachElement(t, n) {
  if (isComment(t) && t.data === '[') {
    let o = 1,
      s = t.nextSibling
    for (; s; ) {
      if (s.nodeType === 1) {
        if (n(s) === !1) break
      } else if (isComment(s))
        if (s.data === ']') {
          if (--o === 0) break
        } else s.data === '[' && o++
      s = s.nextSibling
    }
  } else n(t)
}
const isAsyncWrapper = (t) => !!t.type.__asyncLoader
/*! #__NO_SIDE_EFFECTS__ */ function defineAsyncComponent(t) {
  isFunction(t) && (t = { loader: t })
  const {
    loader: n,
    loadingComponent: o,
    errorComponent: s,
    delay: r = 200,
    hydrate: i,
    timeout: a,
    suspensible: c = !0,
    onError: u,
  } = t
  let g = null,
    d,
    v = 0
  const y = () => (v++, (g = null), _()),
    _ = () => {
      let $
      return (
        g ||
        ($ = g =
          n()
            .catch((A) => {
              if (((A = A instanceof Error ? A : new Error(String(A))), u))
                return new Promise((k, O) => {
                  u(
                    A,
                    () => k(y()),
                    () => O(A),
                    v + 1,
                  )
                })
              throw A
            })
            .then((A) =>
              $ !== g && g
                ? g
                : (A && (A.__esModule || A[Symbol.toStringTag] === 'Module') && (A = A.default),
                  (d = A),
                  A),
            ))
      )
    }
  return defineComponent({
    name: 'AsyncComponentWrapper',
    __asyncLoader: _,
    __asyncHydrate($, A, k) {
      const O = i
        ? () => {
            const B = i(
              () => {
                k()
              },
              (P) => forEachElement($, P),
            )
            B && (A.bum || (A.bum = [])).push(B), (A.u || (A.u = [])).push(() => !0)
          }
        : k
      d ? O() : _().then(() => !A.isUnmounted && O())
    },
    get __asyncResolved() {
      return d
    },
    setup() {
      const $ = currentInstance
      if ((markAsyncBoundary($), d)) return () => createInnerComp(d, $)
      const A = (B) => {
        ;(g = null), handleError(B, $, 13, !s)
      }
      if ((c && $.suspense) || isInSSRComponentSetup)
        return _()
          .then((B) => () => createInnerComp(B, $))
          .catch((B) => (A(B), () => (s ? createVNode(s, { error: B }) : null)))
      const k = ref(!1),
        O = ref(),
        j = ref(!!r)
      return (
        r &&
          setTimeout(() => {
            j.value = !1
          }, r),
        a != null &&
          setTimeout(() => {
            if (!k.value && !O.value) {
              const B = new Error(`Async component timed out after ${a}ms.`)
              A(B), (O.value = B)
            }
          }, a),
        _()
          .then(() => {
            ;(k.value = !0), $.parent && isKeepAlive($.parent.vnode) && $.parent.update()
          })
          .catch((B) => {
            A(B), (O.value = B)
          }),
        () => {
          if (k.value && d) return createInnerComp(d, $)
          if (O.value && s) return createVNode(s, { error: O.value })
          if (o && !j.value) return createVNode(o)
        }
      )
    },
  })
}
function createInnerComp(t, n) {
  const { ref: o, props: s, children: r, ce: i } = n.vnode,
    a = createVNode(t, s, r)
  return (a.ref = o), (a.ce = i), delete n.vnode.ce, a
}
const isKeepAlive = (t) => t.type.__isKeepAlive,
  KeepAliveImpl = {
    name: 'KeepAlive',
    __isKeepAlive: !0,
    props: {
      include: [String, RegExp, Array],
      exclude: [String, RegExp, Array],
      max: [String, Number],
    },
    setup(t, { slots: n }) {
      const o = getCurrentInstance(),
        s = o.ctx
      if (!s.renderer)
        return () => {
          const j = n.default && n.default()
          return j && j.length === 1 ? j[0] : j
        }
      const r = new Map(),
        i = new Set()
      let a = null
      const c = o.suspense,
        {
          renderer: {
            p: u,
            m: g,
            um: d,
            o: { createElement: v },
          },
        } = s,
        y = v('div')
      ;(s.activate = (j, B, P, F, Be) => {
        const Se = j.component
        g(j, B, P, 0, c),
          u(Se.vnode, j, B, P, Se, c, F, j.slotScopeIds, Be),
          queuePostRenderEffect(() => {
            ;(Se.isDeactivated = !1), Se.a && invokeArrayFns(Se.a)
            const L = j.props && j.props.onVnodeMounted
            L && invokeVNodeHook(L, Se.parent, j)
          }, c)
      }),
        (s.deactivate = (j) => {
          const B = j.component
          invalidateMount(B.m),
            invalidateMount(B.a),
            g(j, y, null, 1, c),
            queuePostRenderEffect(() => {
              B.da && invokeArrayFns(B.da)
              const P = j.props && j.props.onVnodeUnmounted
              P && invokeVNodeHook(P, B.parent, j), (B.isDeactivated = !0)
            }, c)
        })
      function _(j) {
        resetShapeFlag(j), d(j, o, c, !0)
      }
      function $(j) {
        r.forEach((B, P) => {
          const F = getComponentName(B.type)
          F && !j(F) && A(P)
        })
      }
      function A(j) {
        const B = r.get(j)
        B && (!a || !isSameVNodeType(B, a)) ? _(B) : a && resetShapeFlag(a),
          r.delete(j),
          i.delete(j)
      }
      watch(
        () => [t.include, t.exclude],
        ([j, B]) => {
          j && $((P) => matches(j, P)), B && $((P) => !matches(B, P))
        },
        { flush: 'post', deep: !0 },
      )
      let k = null
      const O = () => {
        k != null &&
          (isSuspense(o.subTree.type)
            ? queuePostRenderEffect(() => {
                r.set(k, getInnerChild(o.subTree))
              }, o.subTree.suspense)
            : r.set(k, getInnerChild(o.subTree)))
      }
      return (
        onMounted(O),
        onUpdated(O),
        onBeforeUnmount(() => {
          r.forEach((j) => {
            const { subTree: B, suspense: P } = o,
              F = getInnerChild(B)
            if (j.type === F.type && j.key === F.key) {
              resetShapeFlag(F)
              const Be = F.component.da
              Be && queuePostRenderEffect(Be, P)
              return
            }
            _(j)
          })
        }),
        () => {
          if (((k = null), !n.default)) return (a = null)
          const j = n.default(),
            B = j[0]
          if (j.length > 1) return (a = null), j
          if (!isVNode(B) || (!(B.shapeFlag & 4) && !(B.shapeFlag & 128))) return (a = null), B
          let P = getInnerChild(B)
          if (P.type === Comment) return (a = null), P
          const F = P.type,
            Be = getComponentName(isAsyncWrapper(P) ? P.type.__asyncResolved || {} : F),
            { include: Se, exclude: L, max: R } = t
          if ((Se && (!Be || !matches(Se, Be))) || (L && Be && matches(L, Be)))
            return (P.shapeFlag &= -257), (a = P), B
          const D = P.key == null ? F : P.key,
            Te = r.get(D)
          return (
            P.el && ((P = cloneVNode(P)), B.shapeFlag & 128 && (B.ssContent = P)),
            (k = D),
            Te
              ? ((P.el = Te.el),
                (P.component = Te.component),
                P.transition && setTransitionHooks(P, P.transition),
                (P.shapeFlag |= 512),
                i.delete(D),
                i.add(D))
              : (i.add(D), R && i.size > parseInt(R, 10) && A(i.values().next().value)),
            (P.shapeFlag |= 256),
            (a = P),
            isSuspense(B.type) ? B : P
          )
        }
      )
    },
  },
  KeepAlive = KeepAliveImpl
function matches(t, n) {
  return isArray$1(t)
    ? t.some((o) => matches(o, n))
    : isString(t)
      ? t.split(',').includes(n)
      : isRegExp(t)
        ? ((t.lastIndex = 0), t.test(n))
        : !1
}
function onActivated(t, n) {
  registerKeepAliveHook(t, 'a', n)
}
function onDeactivated(t, n) {
  registerKeepAliveHook(t, 'da', n)
}
function registerKeepAliveHook(t, n, o = currentInstance) {
  const s =
    t.__wdc ||
    (t.__wdc = () => {
      let r = o
      for (; r; ) {
        if (r.isDeactivated) return
        r = r.parent
      }
      return t()
    })
  if ((injectHook(n, s, o), o)) {
    let r = o.parent
    for (; r && r.parent; )
      isKeepAlive(r.parent.vnode) && injectToKeepAliveRoot(s, n, o, r), (r = r.parent)
  }
}
function injectToKeepAliveRoot(t, n, o, s) {
  const r = injectHook(n, t, s, !0)
  onUnmounted(() => {
    remove(s[n], r)
  }, o)
}
function resetShapeFlag(t) {
  ;(t.shapeFlag &= -257), (t.shapeFlag &= -513)
}
function getInnerChild(t) {
  return t.shapeFlag & 128 ? t.ssContent : t
}
function injectHook(t, n, o = currentInstance, s = !1) {
  if (o) {
    const r = o[t] || (o[t] = []),
      i =
        n.__weh ||
        (n.__weh = (...a) => {
          pauseTracking()
          const c = setCurrentInstance(o),
            u = callWithAsyncErrorHandling(n, o, t, a)
          return c(), resetTracking(), u
        })
    return s ? r.unshift(i) : r.push(i), i
  }
}
const createHook =
    (t) =>
    (n, o = currentInstance) => {
      ;(!isInSSRComponentSetup || t === 'sp') && injectHook(t, (...s) => n(...s), o)
    },
  onBeforeMount = createHook('bm'),
  onMounted = createHook('m'),
  onBeforeUpdate = createHook('bu'),
  onUpdated = createHook('u'),
  onBeforeUnmount = createHook('bum'),
  onUnmounted = createHook('um'),
  onServerPrefetch = createHook('sp'),
  onRenderTriggered = createHook('rtg'),
  onRenderTracked = createHook('rtc')
function onErrorCaptured(t, n = currentInstance) {
  injectHook('ec', t, n)
}
const COMPONENTS = 'components',
  DIRECTIVES = 'directives'
function resolveComponent(t, n) {
  return resolveAsset(COMPONENTS, t, !0, n) || t
}
const NULL_DYNAMIC_COMPONENT = Symbol.for('v-ndc')
function resolveDynamicComponent(t) {
  return isString(t) ? resolveAsset(COMPONENTS, t, !1) || t : t || NULL_DYNAMIC_COMPONENT
}
function resolveDirective(t) {
  return resolveAsset(DIRECTIVES, t)
}
function resolveAsset(t, n, o = !0, s = !1) {
  const r = currentRenderingInstance || currentInstance
  if (r) {
    const i = r.type
    if (t === COMPONENTS) {
      const c = getComponentName(i, !1)
      if (c && (c === n || c === camelize(n) || c === capitalize(camelize(n)))) return i
    }
    const a = resolve(r[t] || i[t], n) || resolve(r.appContext[t], n)
    return !a && s ? i : a
  }
}
function resolve(t, n) {
  return t && (t[n] || t[camelize(n)] || t[capitalize(camelize(n))])
}
function renderList(t, n, o, s) {
  let r
  const i = o && o[s],
    a = isArray$1(t)
  if (a || isString(t)) {
    const c = a && isReactive(t)
    let u = !1,
      g = !1
    c && ((u = !isShallow(t)), (g = isReadonly(t)), (t = shallowReadArray(t))),
      (r = new Array(t.length))
    for (let d = 0, v = t.length; d < v; d++)
      r[d] = n(
        u ? (g ? toReadonly(toReactive(t[d])) : toReactive(t[d])) : t[d],
        d,
        void 0,
        i && i[d],
      )
  } else if (typeof t == 'number') {
    r = new Array(t)
    for (let c = 0; c < t; c++) r[c] = n(c + 1, c, void 0, i && i[c])
  } else if (isObject(t))
    if (t[Symbol.iterator]) r = Array.from(t, (c, u) => n(c, u, void 0, i && i[u]))
    else {
      const c = Object.keys(t)
      r = new Array(c.length)
      for (let u = 0, g = c.length; u < g; u++) {
        const d = c[u]
        r[u] = n(t[d], d, u, i && i[u])
      }
    }
  else r = []
  return o && (o[s] = r), r
}
function createSlots(t, n) {
  for (let o = 0; o < n.length; o++) {
    const s = n[o]
    if (isArray$1(s)) for (let r = 0; r < s.length; r++) t[s[r].name] = s[r].fn
    else
      s &&
        (t[s.name] = s.key
          ? (...r) => {
              const i = s.fn(...r)
              return i && (i.key = s.key), i
            }
          : s.fn)
  }
  return t
}
function renderSlot(t, n, o = {}, s, r) {
  if (
    currentRenderingInstance.ce ||
    (currentRenderingInstance.parent &&
      isAsyncWrapper(currentRenderingInstance.parent) &&
      currentRenderingInstance.parent.ce)
  )
    return (
      n !== 'default' && (o.name = n),
      openBlock(),
      createBlock(Fragment, null, [createVNode('slot', o, s && s())], 64)
    )
  let i = t[n]
  i && i._c && (i._d = !1), openBlock()
  const a = i && ensureValidVNode(i(o)),
    c = o.key || (a && a.key),
    u = createBlock(
      Fragment,
      { key: (c && !isSymbol(c) ? c : `_${n}`) + (!a && s ? '_fb' : '') },
      a || (s ? s() : []),
      a && t._ === 1 ? 64 : -2,
    )
  return !r && u.scopeId && (u.slotScopeIds = [u.scopeId + '-s']), i && i._c && (i._d = !0), u
}
function ensureValidVNode(t) {
  return t.some((n) =>
    isVNode(n)
      ? !(n.type === Comment || (n.type === Fragment && !ensureValidVNode(n.children)))
      : !0,
  )
    ? t
    : null
}
function toHandlers(t, n) {
  const o = {}
  for (const s in t) o[n && /[A-Z]/.test(s) ? `on:${s}` : toHandlerKey(s)] = t[s]
  return o
}
const getPublicInstance = (t) =>
    t
      ? isStatefulComponent(t)
        ? getComponentPublicInstance(t)
        : getPublicInstance(t.parent)
      : null,
  publicPropertiesMap = extend(Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => getPublicInstance(t.parent),
    $root: (t) => getPublicInstance(t.root),
    $host: (t) => t.ce,
    $emit: (t) => t.emit,
    $options: (t) => resolveMergedOptions(t),
    $forceUpdate: (t) =>
      t.f ||
      (t.f = () => {
        queueJob(t.update)
      }),
    $nextTick: (t) => t.n || (t.n = nextTick.bind(t.proxy)),
    $watch: (t) => instanceWatch.bind(t),
  }),
  hasSetupBinding = (t, n) => t !== EMPTY_OBJ && !t.__isScriptSetup && hasOwn(t, n),
  PublicInstanceProxyHandlers = {
    get({ _: t }, n) {
      if (n === '__v_skip') return !0
      const { ctx: o, setupState: s, data: r, props: i, accessCache: a, type: c, appContext: u } = t
      let g
      if (n[0] !== '$') {
        const _ = a[n]
        if (_ !== void 0)
          switch (_) {
            case 1:
              return s[n]
            case 2:
              return r[n]
            case 4:
              return o[n]
            case 3:
              return i[n]
          }
        else {
          if (hasSetupBinding(s, n)) return (a[n] = 1), s[n]
          if (r !== EMPTY_OBJ && hasOwn(r, n)) return (a[n] = 2), r[n]
          if ((g = t.propsOptions[0]) && hasOwn(g, n)) return (a[n] = 3), i[n]
          if (o !== EMPTY_OBJ && hasOwn(o, n)) return (a[n] = 4), o[n]
          shouldCacheAccess && (a[n] = 0)
        }
      }
      const d = publicPropertiesMap[n]
      let v, y
      if (d) return n === '$attrs' && track(t.attrs, 'get', ''), d(t)
      if ((v = c.__cssModules) && (v = v[n])) return v
      if (o !== EMPTY_OBJ && hasOwn(o, n)) return (a[n] = 4), o[n]
      if (((y = u.config.globalProperties), hasOwn(y, n))) return y[n]
    },
    set({ _: t }, n, o) {
      const { data: s, setupState: r, ctx: i } = t
      return hasSetupBinding(r, n)
        ? ((r[n] = o), !0)
        : s !== EMPTY_OBJ && hasOwn(s, n)
          ? ((s[n] = o), !0)
          : hasOwn(t.props, n) || (n[0] === '$' && n.slice(1) in t)
            ? !1
            : ((i[n] = o), !0)
    },
    has(
      { _: { data: t, setupState: n, accessCache: o, ctx: s, appContext: r, propsOptions: i } },
      a,
    ) {
      let c
      return (
        !!o[a] ||
        (t !== EMPTY_OBJ && hasOwn(t, a)) ||
        hasSetupBinding(n, a) ||
        ((c = i[0]) && hasOwn(c, a)) ||
        hasOwn(s, a) ||
        hasOwn(publicPropertiesMap, a) ||
        hasOwn(r.config.globalProperties, a)
      )
    },
    defineProperty(t, n, o) {
      return (
        o.get != null
          ? (t._.accessCache[n] = 0)
          : hasOwn(o, 'value') && this.set(t, n, o.value, null),
        Reflect.defineProperty(t, n, o)
      )
    },
  },
  RuntimeCompiledPublicInstanceProxyHandlers = extend({}, PublicInstanceProxyHandlers, {
    get(t, n) {
      if (n !== Symbol.unscopables) return PublicInstanceProxyHandlers.get(t, n, t)
    },
    has(t, n) {
      return n[0] !== '_' && !isGloballyAllowed(n)
    },
  })
function defineProps() {
  return null
}
function defineEmits() {
  return null
}
function defineExpose(t) {}
function defineOptions(t) {}
function defineSlots() {
  return null
}
function defineModel() {}
function withDefaults(t, n) {
  return null
}
function useSlots() {
  return getContext().slots
}
function useAttrs() {
  return getContext().attrs
}
function getContext() {
  const t = getCurrentInstance()
  return t.setupContext || (t.setupContext = createSetupContext(t))
}
function normalizePropsOrEmits(t) {
  return isArray$1(t) ? t.reduce((n, o) => ((n[o] = null), n), {}) : t
}
function mergeDefaults(t, n) {
  const o = normalizePropsOrEmits(t)
  for (const s in n) {
    if (s.startsWith('__skip')) continue
    let r = o[s]
    r
      ? isArray$1(r) || isFunction(r)
        ? (r = o[s] = { type: r, default: n[s] })
        : (r.default = n[s])
      : r === null && (r = o[s] = { default: n[s] }),
      r && n[`__skip_${s}`] && (r.skipFactory = !0)
  }
  return o
}
function mergeModels(t, n) {
  return !t || !n
    ? t || n
    : isArray$1(t) && isArray$1(n)
      ? t.concat(n)
      : extend({}, normalizePropsOrEmits(t), normalizePropsOrEmits(n))
}
function createPropsRestProxy(t, n) {
  const o = {}
  for (const s in t)
    n.includes(s) || Object.defineProperty(o, s, { enumerable: !0, get: () => t[s] })
  return o
}
function withAsyncContext(t) {
  const n = getCurrentInstance()
  let o = t()
  return (
    unsetCurrentInstance(),
    isPromise(o) &&
      (o = o.catch((s) => {
        throw (setCurrentInstance(n), s)
      })),
    [o, () => setCurrentInstance(n)]
  )
}
let shouldCacheAccess = !0
function applyOptions(t) {
  const n = resolveMergedOptions(t),
    o = t.proxy,
    s = t.ctx
  ;(shouldCacheAccess = !1), n.beforeCreate && callHook$1(n.beforeCreate, t, 'bc')
  const {
    data: r,
    computed: i,
    methods: a,
    watch: c,
    provide: u,
    inject: g,
    created: d,
    beforeMount: v,
    mounted: y,
    beforeUpdate: _,
    updated: $,
    activated: A,
    deactivated: k,
    beforeDestroy: O,
    beforeUnmount: j,
    destroyed: B,
    unmounted: P,
    render: F,
    renderTracked: Be,
    renderTriggered: Se,
    errorCaptured: L,
    serverPrefetch: R,
    expose: D,
    inheritAttrs: Te,
    components: K,
    directives: De,
    filters: je,
  } = n
  if ((g && resolveInjections(g, s, null), a))
    for (const Ze in a) {
      const Ke = a[Ze]
      isFunction(Ke) && (s[Ze] = Ke.bind(o))
    }
  if (r) {
    const Ze = r.call(o, o)
    isObject(Ze) && (t.data = reactive(Ze))
  }
  if (((shouldCacheAccess = !0), i))
    for (const Ze in i) {
      const Ke = i[Ze],
        rt = isFunction(Ke) ? Ke.bind(o, o) : isFunction(Ke.get) ? Ke.get.bind(o, o) : NOOP,
        it = !isFunction(Ke) && isFunction(Ke.set) ? Ke.set.bind(o) : NOOP,
        ct = computed({ get: rt, set: it })
      Object.defineProperty(s, Ze, {
        enumerable: !0,
        configurable: !0,
        get: () => ct.value,
        set: (ut) => (ct.value = ut),
      })
    }
  if (c) for (const Ze in c) createWatcher(c[Ze], s, o, Ze)
  if (u) {
    const Ze = isFunction(u) ? u.call(o) : u
    Reflect.ownKeys(Ze).forEach((Ke) => {
      provide(Ke, Ze[Ke])
    })
  }
  d && callHook$1(d, t, 'c')
  function xe(Ze, Ke) {
    isArray$1(Ke) ? Ke.forEach((rt) => Ze(rt.bind(o))) : Ke && Ze(Ke.bind(o))
  }
  if (
    (xe(onBeforeMount, v),
    xe(onMounted, y),
    xe(onBeforeUpdate, _),
    xe(onUpdated, $),
    xe(onActivated, A),
    xe(onDeactivated, k),
    xe(onErrorCaptured, L),
    xe(onRenderTracked, Be),
    xe(onRenderTriggered, Se),
    xe(onBeforeUnmount, j),
    xe(onUnmounted, P),
    xe(onServerPrefetch, R),
    isArray$1(D))
  )
    if (D.length) {
      const Ze = t.exposed || (t.exposed = {})
      D.forEach((Ke) => {
        Object.defineProperty(Ze, Ke, { get: () => o[Ke], set: (rt) => (o[Ke] = rt) })
      })
    } else t.exposed || (t.exposed = {})
  F && t.render === NOOP && (t.render = F),
    Te != null && (t.inheritAttrs = Te),
    K && (t.components = K),
    De && (t.directives = De),
    R && markAsyncBoundary(t)
}
function resolveInjections(t, n, o = NOOP) {
  isArray$1(t) && (t = normalizeInject(t))
  for (const s in t) {
    const r = t[s]
    let i
    isObject(r)
      ? 'default' in r
        ? (i = inject(r.from || s, r.default, !0))
        : (i = inject(r.from || s))
      : (i = inject(r)),
      isRef(i)
        ? Object.defineProperty(n, s, {
            enumerable: !0,
            configurable: !0,
            get: () => i.value,
            set: (a) => (i.value = a),
          })
        : (n[s] = i)
  }
}
function callHook$1(t, n, o) {
  callWithAsyncErrorHandling(isArray$1(t) ? t.map((s) => s.bind(n.proxy)) : t.bind(n.proxy), n, o)
}
function createWatcher(t, n, o, s) {
  let r = s.includes('.') ? createPathGetter(o, s) : () => o[s]
  if (isString(t)) {
    const i = n[t]
    isFunction(i) && watch(r, i)
  } else if (isFunction(t)) watch(r, t.bind(o))
  else if (isObject(t))
    if (isArray$1(t)) t.forEach((i) => createWatcher(i, n, o, s))
    else {
      const i = isFunction(t.handler) ? t.handler.bind(o) : n[t.handler]
      isFunction(i) && watch(r, i, t)
    }
}
function resolveMergedOptions(t) {
  const n = t.type,
    { mixins: o, extends: s } = n,
    {
      mixins: r,
      optionsCache: i,
      config: { optionMergeStrategies: a },
    } = t.appContext,
    c = i.get(n)
  let u
  return (
    c
      ? (u = c)
      : !r.length && !o && !s
        ? (u = n)
        : ((u = {}),
          r.length && r.forEach((g) => mergeOptions$1(u, g, a, !0)),
          mergeOptions$1(u, n, a)),
    isObject(n) && i.set(n, u),
    u
  )
}
function mergeOptions$1(t, n, o, s = !1) {
  const { mixins: r, extends: i } = n
  i && mergeOptions$1(t, i, o, !0), r && r.forEach((a) => mergeOptions$1(t, a, o, !0))
  for (const a in n)
    if (!(s && a === 'expose')) {
      const c = internalOptionMergeStrats[a] || (o && o[a])
      t[a] = c ? c(t[a], n[a]) : n[a]
    }
  return t
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject,
}
function mergeDataFn(t, n) {
  return n
    ? t
      ? function () {
          return extend(
            isFunction(t) ? t.call(this, this) : t,
            isFunction(n) ? n.call(this, this) : n,
          )
        }
      : n
    : t
}
function mergeInject(t, n) {
  return mergeObjectOptions(normalizeInject(t), normalizeInject(n))
}
function normalizeInject(t) {
  if (isArray$1(t)) {
    const n = {}
    for (let o = 0; o < t.length; o++) n[t[o]] = t[o]
    return n
  }
  return t
}
function mergeAsArray(t, n) {
  return t ? [...new Set([].concat(t, n))] : n
}
function mergeObjectOptions(t, n) {
  return t ? extend(Object.create(null), t, n) : n
}
function mergeEmitsOrPropsOptions(t, n) {
  return t
    ? isArray$1(t) && isArray$1(n)
      ? [...new Set([...t, ...n])]
      : extend(Object.create(null), normalizePropsOrEmits(t), normalizePropsOrEmits(n ?? {}))
    : n
}
function mergeWatchOptions(t, n) {
  if (!t) return n
  if (!n) return t
  const o = extend(Object.create(null), t)
  for (const s in n) o[s] = mergeAsArray(t[s], n[s])
  return o
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  }
}
let uid$1 = 0
function createAppAPI(t, n) {
  return function (s, r = null) {
    isFunction(s) || (s = extend({}, s)), r != null && !isObject(r) && (r = null)
    const i = createAppContext(),
      a = new WeakSet(),
      c = []
    let u = !1
    const g = (i.app = {
      _uid: uid$1++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version,
      get config() {
        return i.config
      },
      set config(d) {},
      use(d, ...v) {
        return (
          a.has(d) ||
            (d && isFunction(d.install)
              ? (a.add(d), d.install(g, ...v))
              : isFunction(d) && (a.add(d), d(g, ...v))),
          g
        )
      },
      mixin(d) {
        return i.mixins.includes(d) || i.mixins.push(d), g
      },
      component(d, v) {
        return v ? ((i.components[d] = v), g) : i.components[d]
      },
      directive(d, v) {
        return v ? ((i.directives[d] = v), g) : i.directives[d]
      },
      mount(d, v, y) {
        if (!u) {
          const _ = g._ceVNode || createVNode(s, r)
          return (
            (_.appContext = i),
            y === !0 ? (y = 'svg') : y === !1 && (y = void 0),
            v && n ? n(_, d) : t(_, d, y),
            (u = !0),
            (g._container = d),
            (d.__vue_app__ = g),
            getComponentPublicInstance(_.component)
          )
        }
      },
      onUnmount(d) {
        c.push(d)
      },
      unmount() {
        u &&
          (callWithAsyncErrorHandling(c, g._instance, 16),
          t(null, g._container),
          delete g._container.__vue_app__)
      },
      provide(d, v) {
        return (i.provides[d] = v), g
      },
      runWithContext(d) {
        const v = currentApp
        currentApp = g
        try {
          return d()
        } finally {
          currentApp = v
        }
      },
    })
    return g
  }
}
let currentApp = null
function provide(t, n) {
  if (currentInstance) {
    let o = currentInstance.provides
    const s = currentInstance.parent && currentInstance.parent.provides
    s === o && (o = currentInstance.provides = Object.create(s)), (o[t] = n)
  }
}
function inject(t, n, o = !1) {
  const s = currentInstance || currentRenderingInstance
  if (s || currentApp) {
    let r = currentApp
      ? currentApp._context.provides
      : s
        ? s.parent == null || s.ce
          ? s.vnode.appContext && s.vnode.appContext.provides
          : s.parent.provides
        : void 0
    if (r && t in r) return r[t]
    if (arguments.length > 1) return o && isFunction(n) ? n.call(s && s.proxy) : n
  }
}
function hasInjectionContext() {
  return !!(currentInstance || currentRenderingInstance || currentApp)
}
const internalObjectProto = {},
  createInternalObject = () => Object.create(internalObjectProto),
  isInternalObject = (t) => Object.getPrototypeOf(t) === internalObjectProto
function initProps(t, n, o, s = !1) {
  const r = {},
    i = createInternalObject()
  ;(t.propsDefaults = Object.create(null)), setFullProps(t, n, r, i)
  for (const a in t.propsOptions[0]) a in r || (r[a] = void 0)
  o ? (t.props = s ? r : shallowReactive(r)) : t.type.props ? (t.props = r) : (t.props = i),
    (t.attrs = i)
}
function updateProps(t, n, o, s) {
  const {
      props: r,
      attrs: i,
      vnode: { patchFlag: a },
    } = t,
    c = toRaw(r),
    [u] = t.propsOptions
  let g = !1
  if ((s || a > 0) && !(a & 16)) {
    if (a & 8) {
      const d = t.vnode.dynamicProps
      for (let v = 0; v < d.length; v++) {
        let y = d[v]
        if (isEmitListener(t.emitsOptions, y)) continue
        const _ = n[y]
        if (u)
          if (hasOwn(i, y)) _ !== i[y] && ((i[y] = _), (g = !0))
          else {
            const $ = camelize(y)
            r[$] = resolvePropValue(u, c, $, _, t, !1)
          }
        else _ !== i[y] && ((i[y] = _), (g = !0))
      }
    }
  } else {
    setFullProps(t, n, r, i) && (g = !0)
    let d
    for (const v in c)
      (!n || (!hasOwn(n, v) && ((d = hyphenate(v)) === v || !hasOwn(n, d)))) &&
        (u
          ? o &&
            (o[v] !== void 0 || o[d] !== void 0) &&
            (r[v] = resolvePropValue(u, c, v, void 0, t, !0))
          : delete r[v])
    if (i !== c) for (const v in i) (!n || !hasOwn(n, v)) && (delete i[v], (g = !0))
  }
  g && trigger(t.attrs, 'set', '')
}
function setFullProps(t, n, o, s) {
  const [r, i] = t.propsOptions
  let a = !1,
    c
  if (n)
    for (let u in n) {
      if (isReservedProp(u)) continue
      const g = n[u]
      let d
      r && hasOwn(r, (d = camelize(u)))
        ? !i || !i.includes(d)
          ? (o[d] = g)
          : ((c || (c = {}))[d] = g)
        : isEmitListener(t.emitsOptions, u) || ((!(u in s) || g !== s[u]) && ((s[u] = g), (a = !0)))
    }
  if (i) {
    const u = toRaw(o),
      g = c || EMPTY_OBJ
    for (let d = 0; d < i.length; d++) {
      const v = i[d]
      o[v] = resolvePropValue(r, u, v, g[v], t, !hasOwn(g, v))
    }
  }
  return a
}
function resolvePropValue(t, n, o, s, r, i) {
  const a = t[o]
  if (a != null) {
    const c = hasOwn(a, 'default')
    if (c && s === void 0) {
      const u = a.default
      if (a.type !== Function && !a.skipFactory && isFunction(u)) {
        const { propsDefaults: g } = r
        if (o in g) s = g[o]
        else {
          const d = setCurrentInstance(r)
          ;(s = g[o] = u.call(null, n)), d()
        }
      } else s = u
      r.ce && r.ce._setProp(o, s)
    }
    a[0] && (i && !c ? (s = !1) : a[1] && (s === '' || s === hyphenate(o)) && (s = !0))
  }
  return s
}
const mixinPropsCache = new WeakMap()
function normalizePropsOptions(t, n, o = !1) {
  const s = o ? mixinPropsCache : n.propsCache,
    r = s.get(t)
  if (r) return r
  const i = t.props,
    a = {},
    c = []
  let u = !1
  if (!isFunction(t)) {
    const d = (v) => {
      u = !0
      const [y, _] = normalizePropsOptions(v, n, !0)
      extend(a, y), _ && c.push(..._)
    }
    !o && n.mixins.length && n.mixins.forEach(d),
      t.extends && d(t.extends),
      t.mixins && t.mixins.forEach(d)
  }
  if (!i && !u) return isObject(t) && s.set(t, EMPTY_ARR), EMPTY_ARR
  if (isArray$1(i))
    for (let d = 0; d < i.length; d++) {
      const v = camelize(i[d])
      validatePropName(v) && (a[v] = EMPTY_OBJ)
    }
  else if (i)
    for (const d in i) {
      const v = camelize(d)
      if (validatePropName(v)) {
        const y = i[d],
          _ = (a[v] = isArray$1(y) || isFunction(y) ? { type: y } : extend({}, y)),
          $ = _.type
        let A = !1,
          k = !0
        if (isArray$1($))
          for (let O = 0; O < $.length; ++O) {
            const j = $[O],
              B = isFunction(j) && j.name
            if (B === 'Boolean') {
              A = !0
              break
            } else B === 'String' && (k = !1)
          }
        else A = isFunction($) && $.name === 'Boolean'
        ;(_[0] = A), (_[1] = k), (A || hasOwn(_, 'default')) && c.push(v)
      }
    }
  const g = [a, c]
  return isObject(t) && s.set(t, g), g
}
function validatePropName(t) {
  return t[0] !== '$' && !isReservedProp(t)
}
const isInternalKey = (t) => t[0] === '_' || t === '$stable',
  normalizeSlotValue = (t) => (isArray$1(t) ? t.map(normalizeVNode) : [normalizeVNode(t)]),
  normalizeSlot$1 = (t, n, o) => {
    if (n._n) return n
    const s = withCtx((...r) => normalizeSlotValue(n(...r)), o)
    return (s._c = !1), s
  },
  normalizeObjectSlots = (t, n, o) => {
    const s = t._ctx
    for (const r in t) {
      if (isInternalKey(r)) continue
      const i = t[r]
      if (isFunction(i)) n[r] = normalizeSlot$1(r, i, s)
      else if (i != null) {
        const a = normalizeSlotValue(i)
        n[r] = () => a
      }
    }
  },
  normalizeVNodeSlots = (t, n) => {
    const o = normalizeSlotValue(n)
    t.slots.default = () => o
  },
  assignSlots = (t, n, o) => {
    for (const s in n) (o || !isInternalKey(s)) && (t[s] = n[s])
  },
  initSlots = (t, n, o) => {
    const s = (t.slots = createInternalObject())
    if (t.vnode.shapeFlag & 32) {
      const r = n.__
      r && def(s, '__', r, !0)
      const i = n._
      i ? (assignSlots(s, n, o), o && def(s, '_', i, !0)) : normalizeObjectSlots(n, s)
    } else n && normalizeVNodeSlots(t, n)
  },
  updateSlots = (t, n, o) => {
    const { vnode: s, slots: r } = t
    let i = !0,
      a = EMPTY_OBJ
    if (s.shapeFlag & 32) {
      const c = n._
      c
        ? o && c === 1
          ? (i = !1)
          : assignSlots(r, n, o)
        : ((i = !n.$stable), normalizeObjectSlots(n, r)),
        (a = n)
    } else n && (normalizeVNodeSlots(t, n), (a = { default: 1 }))
    if (i) for (const c in r) !isInternalKey(c) && a[c] == null && delete r[c]
  },
  queuePostRenderEffect = queueEffectWithSuspense
function createRenderer(t) {
  return baseCreateRenderer(t)
}
function createHydrationRenderer(t) {
  return baseCreateRenderer(t, createHydrationFunctions)
}
function baseCreateRenderer(t, n) {
  const o = getGlobalThis()
  o.__VUE__ = !0
  const {
      insert: s,
      remove: r,
      patchProp: i,
      createElement: a,
      createText: c,
      createComment: u,
      setText: g,
      setElementText: d,
      parentNode: v,
      nextSibling: y,
      setScopeId: _ = NOOP,
      insertStaticContent: $,
    } = t,
    A = (
      b,
      w,
      Ve,
      $e = null,
      Ne = null,
      Me = null,
      He = void 0,
      Ie = null,
      ze = !!w.dynamicChildren,
    ) => {
      if (b === w) return
      b && !isSameVNodeType(b, w) && (($e = z(b)), ut(b, Ne, Me, !0), (b = null)),
        w.patchFlag === -2 && ((ze = !1), (w.dynamicChildren = null))
      const { type: Fe, ref: Qe, shapeFlag: Le } = w
      switch (Fe) {
        case Text:
          k(b, w, Ve, $e)
          break
        case Comment:
          O(b, w, Ve, $e)
          break
        case Static:
          b == null && j(w, Ve, $e, He)
          break
        case Fragment:
          K(b, w, Ve, $e, Ne, Me, He, Ie, ze)
          break
        default:
          Le & 1
            ? F(b, w, Ve, $e, Ne, Me, He, Ie, ze)
            : Le & 6
              ? De(b, w, Ve, $e, Ne, Me, He, Ie, ze)
              : (Le & 64 || Le & 128) && Fe.process(b, w, Ve, $e, Ne, Me, He, Ie, ze, Ee)
      }
      Qe != null && Ne
        ? setRef(Qe, b && b.ref, Me, w || b, !w)
        : Qe == null && b && b.ref != null && setRef(b.ref, null, Me, b, !0)
    },
    k = (b, w, Ve, $e) => {
      if (b == null) s((w.el = c(w.children)), Ve, $e)
      else {
        const Ne = (w.el = b.el)
        w.children !== b.children && g(Ne, w.children)
      }
    },
    O = (b, w, Ve, $e) => {
      b == null ? s((w.el = u(w.children || '')), Ve, $e) : (w.el = b.el)
    },
    j = (b, w, Ve, $e) => {
      ;[b.el, b.anchor] = $(b.children, w, Ve, $e, b.el, b.anchor)
    },
    B = ({ el: b, anchor: w }, Ve, $e) => {
      let Ne
      for (; b && b !== w; ) (Ne = y(b)), s(b, Ve, $e), (b = Ne)
      s(w, Ve, $e)
    },
    P = ({ el: b, anchor: w }) => {
      let Ve
      for (; b && b !== w; ) (Ve = y(b)), r(b), (b = Ve)
      r(w)
    },
    F = (b, w, Ve, $e, Ne, Me, He, Ie, ze) => {
      w.type === 'svg' ? (He = 'svg') : w.type === 'math' && (He = 'mathml'),
        b == null ? Be(w, Ve, $e, Ne, Me, He, Ie, ze) : R(b, w, Ne, Me, He, Ie, ze)
    },
    Be = (b, w, Ve, $e, Ne, Me, He, Ie) => {
      let ze, Fe
      const { props: Qe, shapeFlag: Le, transition: Je, dirs: qe } = b
      if (
        ((ze = b.el = a(b.type, Me, Qe && Qe.is, Qe)),
        Le & 8
          ? d(ze, b.children)
          : Le & 16 && L(b.children, ze, null, $e, Ne, resolveChildrenNamespace(b, Me), He, Ie),
        qe && invokeDirectiveHook(b, null, $e, 'created'),
        Se(ze, b, b.scopeId, He, $e),
        Qe)
      ) {
        for (const et in Qe)
          et !== 'value' && !isReservedProp(et) && i(ze, et, null, Qe[et], Me, $e)
        'value' in Qe && i(ze, 'value', null, Qe.value, Me),
          (Fe = Qe.onVnodeBeforeMount) && invokeVNodeHook(Fe, $e, b)
      }
      qe && invokeDirectiveHook(b, null, $e, 'beforeMount')
      const Xe = needTransition(Ne, Je)
      Xe && Je.beforeEnter(ze),
        s(ze, w, Ve),
        ((Fe = Qe && Qe.onVnodeMounted) || Xe || qe) &&
          queuePostRenderEffect(() => {
            Fe && invokeVNodeHook(Fe, $e, b),
              Xe && Je.enter(ze),
              qe && invokeDirectiveHook(b, null, $e, 'mounted')
          }, Ne)
    },
    Se = (b, w, Ve, $e, Ne) => {
      if ((Ve && _(b, Ve), $e)) for (let Me = 0; Me < $e.length; Me++) _(b, $e[Me])
      if (Ne) {
        let Me = Ne.subTree
        if (w === Me || (isSuspense(Me.type) && (Me.ssContent === w || Me.ssFallback === w))) {
          const He = Ne.vnode
          Se(b, He, He.scopeId, He.slotScopeIds, Ne.parent)
        }
      }
    },
    L = (b, w, Ve, $e, Ne, Me, He, Ie, ze = 0) => {
      for (let Fe = ze; Fe < b.length; Fe++) {
        const Qe = (b[Fe] = Ie ? cloneIfMounted(b[Fe]) : normalizeVNode(b[Fe]))
        A(null, Qe, w, Ve, $e, Ne, Me, He, Ie)
      }
    },
    R = (b, w, Ve, $e, Ne, Me, He) => {
      const Ie = (w.el = b.el)
      let { patchFlag: ze, dynamicChildren: Fe, dirs: Qe } = w
      ze |= b.patchFlag & 16
      const Le = b.props || EMPTY_OBJ,
        Je = w.props || EMPTY_OBJ
      let qe
      if (
        (Ve && toggleRecurse(Ve, !1),
        (qe = Je.onVnodeBeforeUpdate) && invokeVNodeHook(qe, Ve, w, b),
        Qe && invokeDirectiveHook(w, b, Ve, 'beforeUpdate'),
        Ve && toggleRecurse(Ve, !0),
        ((Le.innerHTML && Je.innerHTML == null) || (Le.textContent && Je.textContent == null)) &&
          d(Ie, ''),
        Fe
          ? D(b.dynamicChildren, Fe, Ie, Ve, $e, resolveChildrenNamespace(w, Ne), Me)
          : He || Ke(b, w, Ie, null, Ve, $e, resolveChildrenNamespace(w, Ne), Me, !1),
        ze > 0)
      ) {
        if (ze & 16) Te(Ie, Le, Je, Ve, Ne)
        else if (
          (ze & 2 && Le.class !== Je.class && i(Ie, 'class', null, Je.class, Ne),
          ze & 4 && i(Ie, 'style', Le.style, Je.style, Ne),
          ze & 8)
        ) {
          const Xe = w.dynamicProps
          for (let et = 0; et < Xe.length; et++) {
            const st = Xe[et],
              at = Le[st],
              lt = Je[st]
            ;(lt !== at || st === 'value') && i(Ie, st, at, lt, Ne, Ve)
          }
        }
        ze & 1 && b.children !== w.children && d(Ie, w.children)
      } else !He && Fe == null && Te(Ie, Le, Je, Ve, Ne)
      ;((qe = Je.onVnodeUpdated) || Qe) &&
        queuePostRenderEffect(() => {
          qe && invokeVNodeHook(qe, Ve, w, b), Qe && invokeDirectiveHook(w, b, Ve, 'updated')
        }, $e)
    },
    D = (b, w, Ve, $e, Ne, Me, He) => {
      for (let Ie = 0; Ie < w.length; Ie++) {
        const ze = b[Ie],
          Fe = w[Ie],
          Qe =
            ze.el && (ze.type === Fragment || !isSameVNodeType(ze, Fe) || ze.shapeFlag & 198)
              ? v(ze.el)
              : Ve
        A(ze, Fe, Qe, null, $e, Ne, Me, He, !0)
      }
    },
    Te = (b, w, Ve, $e, Ne) => {
      if (w !== Ve) {
        if (w !== EMPTY_OBJ)
          for (const Me in w) !isReservedProp(Me) && !(Me in Ve) && i(b, Me, w[Me], null, Ne, $e)
        for (const Me in Ve) {
          if (isReservedProp(Me)) continue
          const He = Ve[Me],
            Ie = w[Me]
          He !== Ie && Me !== 'value' && i(b, Me, Ie, He, Ne, $e)
        }
        'value' in Ve && i(b, 'value', w.value, Ve.value, Ne)
      }
    },
    K = (b, w, Ve, $e, Ne, Me, He, Ie, ze) => {
      const Fe = (w.el = b ? b.el : c('')),
        Qe = (w.anchor = b ? b.anchor : c(''))
      let { patchFlag: Le, dynamicChildren: Je, slotScopeIds: qe } = w
      qe && (Ie = Ie ? Ie.concat(qe) : qe),
        b == null
          ? (s(Fe, Ve, $e), s(Qe, Ve, $e), L(w.children || [], Ve, Qe, Ne, Me, He, Ie, ze))
          : Le > 0 && Le & 64 && Je && b.dynamicChildren
            ? (D(b.dynamicChildren, Je, Ve, Ne, Me, He, Ie),
              (w.key != null || (Ne && w === Ne.subTree)) && traverseStaticChildren(b, w, !0))
            : Ke(b, w, Ve, Qe, Ne, Me, He, Ie, ze)
    },
    De = (b, w, Ve, $e, Ne, Me, He, Ie, ze) => {
      ;(w.slotScopeIds = Ie),
        b == null
          ? w.shapeFlag & 512
            ? Ne.ctx.activate(w, Ve, $e, He, ze)
            : je(w, Ve, $e, Ne, Me, He, ze)
          : Pe(b, w, ze)
    },
    je = (b, w, Ve, $e, Ne, Me, He) => {
      const Ie = (b.component = createComponentInstance(b, $e, Ne))
      if ((isKeepAlive(b) && (Ie.ctx.renderer = Ee), setupComponent(Ie, !1, He), Ie.asyncDep)) {
        if ((Ne && Ne.registerDep(Ie, xe, He), !b.el)) {
          const ze = (Ie.subTree = createVNode(Comment))
          O(null, ze, w, Ve)
        }
      } else xe(Ie, b, w, Ve, Ne, Me, He)
    },
    Pe = (b, w, Ve) => {
      const $e = (w.component = b.component)
      if (shouldUpdateComponent(b, w, Ve))
        if ($e.asyncDep && !$e.asyncResolved) {
          Ze($e, w, Ve)
          return
        } else ($e.next = w), $e.update()
      else (w.el = b.el), ($e.vnode = w)
    },
    xe = (b, w, Ve, $e, Ne, Me, He) => {
      const Ie = () => {
        if (b.isMounted) {
          let { next: Le, bu: Je, u: qe, parent: Xe, vnode: et } = b
          {
            const ot = locateNonHydratedAsyncRoot(b)
            if (ot) {
              Le && ((Le.el = et.el), Ze(b, Le, He)),
                ot.asyncDep.then(() => {
                  b.isUnmounted || Ie()
                })
              return
            }
          }
          let st = Le,
            at
          toggleRecurse(b, !1),
            Le ? ((Le.el = et.el), Ze(b, Le, He)) : (Le = et),
            Je && invokeArrayFns(Je),
            (at = Le.props && Le.props.onVnodeBeforeUpdate) && invokeVNodeHook(at, Xe, Le, et),
            toggleRecurse(b, !0)
          const lt = renderComponentRoot(b),
            nt = b.subTree
          ;(b.subTree = lt),
            A(nt, lt, v(nt.el), z(nt), b, Ne, Me),
            (Le.el = lt.el),
            st === null && updateHOCHostEl(b, lt.el),
            qe && queuePostRenderEffect(qe, Ne),
            (at = Le.props && Le.props.onVnodeUpdated) &&
              queuePostRenderEffect(() => invokeVNodeHook(at, Xe, Le, et), Ne)
        } else {
          let Le
          const { el: Je, props: qe } = w,
            { bm: Xe, m: et, parent: st, root: at, type: lt } = b,
            nt = isAsyncWrapper(w)
          if (
            (toggleRecurse(b, !1),
            Xe && invokeArrayFns(Xe),
            !nt && (Le = qe && qe.onVnodeBeforeMount) && invokeVNodeHook(Le, st, w),
            toggleRecurse(b, !0),
            Je && Ge)
          ) {
            const ot = () => {
              ;(b.subTree = renderComponentRoot(b)), Ge(Je, b.subTree, b, Ne, null)
            }
            nt && lt.__asyncHydrate ? lt.__asyncHydrate(Je, b, ot) : ot()
          } else {
            at.ce && at.ce._def.shadowRoot !== !1 && at.ce._injectChildStyle(lt)
            const ot = (b.subTree = renderComponentRoot(b))
            A(null, ot, Ve, $e, b, Ne, Me), (w.el = ot.el)
          }
          if ((et && queuePostRenderEffect(et, Ne), !nt && (Le = qe && qe.onVnodeMounted))) {
            const ot = w
            queuePostRenderEffect(() => invokeVNodeHook(Le, st, ot), Ne)
          }
          ;(w.shapeFlag & 256 || (st && isAsyncWrapper(st.vnode) && st.vnode.shapeFlag & 256)) &&
            b.a &&
            queuePostRenderEffect(b.a, Ne),
            (b.isMounted = !0),
            (w = Ve = $e = null)
        }
      }
      b.scope.on()
      const ze = (b.effect = new ReactiveEffect(Ie))
      b.scope.off()
      const Fe = (b.update = ze.run.bind(ze)),
        Qe = (b.job = ze.runIfDirty.bind(ze))
      ;(Qe.i = b), (Qe.id = b.uid), (ze.scheduler = () => queueJob(Qe)), toggleRecurse(b, !0), Fe()
    },
    Ze = (b, w, Ve) => {
      w.component = b
      const $e = b.vnode.props
      ;(b.vnode = w),
        (b.next = null),
        updateProps(b, w.props, $e, Ve),
        updateSlots(b, w.children, Ve),
        pauseTracking(),
        flushPreFlushCbs(b),
        resetTracking()
    },
    Ke = (b, w, Ve, $e, Ne, Me, He, Ie, ze = !1) => {
      const Fe = b && b.children,
        Qe = b ? b.shapeFlag : 0,
        Le = w.children,
        { patchFlag: Je, shapeFlag: qe } = w
      if (Je > 0) {
        if (Je & 128) {
          it(Fe, Le, Ve, $e, Ne, Me, He, Ie, ze)
          return
        } else if (Je & 256) {
          rt(Fe, Le, Ve, $e, Ne, Me, He, Ie, ze)
          return
        }
      }
      qe & 8
        ? (Qe & 16 && We(Fe, Ne, Me), Le !== Fe && d(Ve, Le))
        : Qe & 16
          ? qe & 16
            ? it(Fe, Le, Ve, $e, Ne, Me, He, Ie, ze)
            : We(Fe, Ne, Me, !0)
          : (Qe & 8 && d(Ve, ''), qe & 16 && L(Le, Ve, $e, Ne, Me, He, Ie, ze))
    },
    rt = (b, w, Ve, $e, Ne, Me, He, Ie, ze) => {
      ;(b = b || EMPTY_ARR), (w = w || EMPTY_ARR)
      const Fe = b.length,
        Qe = w.length,
        Le = Math.min(Fe, Qe)
      let Je
      for (Je = 0; Je < Le; Je++) {
        const qe = (w[Je] = ze ? cloneIfMounted(w[Je]) : normalizeVNode(w[Je]))
        A(b[Je], qe, Ve, null, Ne, Me, He, Ie, ze)
      }
      Fe > Qe ? We(b, Ne, Me, !0, !1, Le) : L(w, Ve, $e, Ne, Me, He, Ie, ze, Le)
    },
    it = (b, w, Ve, $e, Ne, Me, He, Ie, ze) => {
      let Fe = 0
      const Qe = w.length
      let Le = b.length - 1,
        Je = Qe - 1
      for (; Fe <= Le && Fe <= Je; ) {
        const qe = b[Fe],
          Xe = (w[Fe] = ze ? cloneIfMounted(w[Fe]) : normalizeVNode(w[Fe]))
        if (isSameVNodeType(qe, Xe)) A(qe, Xe, Ve, null, Ne, Me, He, Ie, ze)
        else break
        Fe++
      }
      for (; Fe <= Le && Fe <= Je; ) {
        const qe = b[Le],
          Xe = (w[Je] = ze ? cloneIfMounted(w[Je]) : normalizeVNode(w[Je]))
        if (isSameVNodeType(qe, Xe)) A(qe, Xe, Ve, null, Ne, Me, He, Ie, ze)
        else break
        Le--, Je--
      }
      if (Fe > Le) {
        if (Fe <= Je) {
          const qe = Je + 1,
            Xe = qe < Qe ? w[qe].el : $e
          for (; Fe <= Je; )
            A(
              null,
              (w[Fe] = ze ? cloneIfMounted(w[Fe]) : normalizeVNode(w[Fe])),
              Ve,
              Xe,
              Ne,
              Me,
              He,
              Ie,
              ze,
            ),
              Fe++
        }
      } else if (Fe > Je) for (; Fe <= Le; ) ut(b[Fe], Ne, Me, !0), Fe++
      else {
        const qe = Fe,
          Xe = Fe,
          et = new Map()
        for (Fe = Xe; Fe <= Je; Fe++) {
          const dt = (w[Fe] = ze ? cloneIfMounted(w[Fe]) : normalizeVNode(w[Fe]))
          dt.key != null && et.set(dt.key, Fe)
        }
        let st,
          at = 0
        const lt = Je - Xe + 1
        let nt = !1,
          ot = 0
        const mt = new Array(lt)
        for (Fe = 0; Fe < lt; Fe++) mt[Fe] = 0
        for (Fe = qe; Fe <= Le; Fe++) {
          const dt = b[Fe]
          if (at >= lt) {
            ut(dt, Ne, Me, !0)
            continue
          }
          let ft
          if (dt.key != null) ft = et.get(dt.key)
          else
            for (st = Xe; st <= Je; st++)
              if (mt[st - Xe] === 0 && isSameVNodeType(dt, w[st])) {
                ft = st
                break
              }
          ft === void 0
            ? ut(dt, Ne, Me, !0)
            : ((mt[ft - Xe] = Fe + 1),
              ft >= ot ? (ot = ft) : (nt = !0),
              A(dt, w[ft], Ve, null, Ne, Me, He, Ie, ze),
              at++)
        }
        const pt = nt ? getSequence(mt) : EMPTY_ARR
        for (st = pt.length - 1, Fe = lt - 1; Fe >= 0; Fe--) {
          const dt = Xe + Fe,
            ft = w[dt],
            gt = dt + 1 < Qe ? w[dt + 1].el : $e
          mt[Fe] === 0
            ? A(null, ft, Ve, gt, Ne, Me, He, Ie, ze)
            : nt && (st < 0 || Fe !== pt[st] ? ct(ft, Ve, gt, 2) : st--)
        }
      }
    },
    ct = (b, w, Ve, $e, Ne = null) => {
      const { el: Me, type: He, transition: Ie, children: ze, shapeFlag: Fe } = b
      if (Fe & 6) {
        ct(b.component.subTree, w, Ve, $e)
        return
      }
      if (Fe & 128) {
        b.suspense.move(w, Ve, $e)
        return
      }
      if (Fe & 64) {
        He.move(b, w, Ve, Ee)
        return
      }
      if (He === Fragment) {
        s(Me, w, Ve)
        for (let Le = 0; Le < ze.length; Le++) ct(ze[Le], w, Ve, $e)
        s(b.anchor, w, Ve)
        return
      }
      if (He === Static) {
        B(b, w, Ve)
        return
      }
      if ($e !== 2 && Fe & 1 && Ie)
        if ($e === 0)
          Ie.beforeEnter(Me), s(Me, w, Ve), queuePostRenderEffect(() => Ie.enter(Me), Ne)
        else {
          const { leave: Le, delayLeave: Je, afterLeave: qe } = Ie,
            Xe = () => {
              b.ctx.isUnmounted ? r(Me) : s(Me, w, Ve)
            },
            et = () => {
              Le(Me, () => {
                Xe(), qe && qe()
              })
            }
          Je ? Je(Me, Xe, et) : et()
        }
      else s(Me, w, Ve)
    },
    ut = (b, w, Ve, $e = !1, Ne = !1) => {
      const {
        type: Me,
        props: He,
        ref: Ie,
        children: ze,
        dynamicChildren: Fe,
        shapeFlag: Qe,
        patchFlag: Le,
        dirs: Je,
        cacheIndex: qe,
      } = b
      if (
        (Le === -2 && (Ne = !1),
        Ie != null && (pauseTracking(), setRef(Ie, null, Ve, b, !0), resetTracking()),
        qe != null && (w.renderCache[qe] = void 0),
        Qe & 256)
      ) {
        w.ctx.deactivate(b)
        return
      }
      const Xe = Qe & 1 && Je,
        et = !isAsyncWrapper(b)
      let st
      if ((et && (st = He && He.onVnodeBeforeUnmount) && invokeVNodeHook(st, w, b), Qe & 6))
        Ae(b.component, Ve, $e)
      else {
        if (Qe & 128) {
          b.suspense.unmount(Ve, $e)
          return
        }
        Xe && invokeDirectiveHook(b, null, w, 'beforeUnmount'),
          Qe & 64
            ? b.type.remove(b, w, Ve, Ee, $e)
            : Fe && !Fe.hasOnce && (Me !== Fragment || (Le > 0 && Le & 64))
              ? We(Fe, w, Ve, !1, !0)
              : ((Me === Fragment && Le & 384) || (!Ne && Qe & 16)) && We(ze, w, Ve),
          $e && ht(b)
      }
      ;((et && (st = He && He.onVnodeUnmounted)) || Xe) &&
        queuePostRenderEffect(() => {
          st && invokeVNodeHook(st, w, b), Xe && invokeDirectiveHook(b, null, w, 'unmounted')
        }, Ve)
    },
    ht = (b) => {
      const { type: w, el: Ve, anchor: $e, transition: Ne } = b
      if (w === Fragment) {
        Ue(Ve, $e)
        return
      }
      if (w === Static) {
        P(b)
        return
      }
      const Me = () => {
        r(Ve), Ne && !Ne.persisted && Ne.afterLeave && Ne.afterLeave()
      }
      if (b.shapeFlag & 1 && Ne && !Ne.persisted) {
        const { leave: He, delayLeave: Ie } = Ne,
          ze = () => He(Ve, Me)
        Ie ? Ie(b.el, Me, ze) : ze()
      } else Me()
    },
    Ue = (b, w) => {
      let Ve
      for (; b !== w; ) (Ve = y(b)), r(b), (b = Ve)
      r(w)
    },
    Ae = (b, w, Ve) => {
      const {
        bum: $e,
        scope: Ne,
        job: Me,
        subTree: He,
        um: Ie,
        m: ze,
        a: Fe,
        parent: Qe,
        slots: { __: Le },
      } = b
      invalidateMount(ze),
        invalidateMount(Fe),
        $e && invokeArrayFns($e),
        Qe &&
          isArray$1(Le) &&
          Le.forEach((Je) => {
            Qe.renderCache[Je] = void 0
          }),
        Ne.stop(),
        Me && ((Me.flags |= 8), ut(He, b, w, Ve)),
        Ie && queuePostRenderEffect(Ie, w),
        queuePostRenderEffect(() => {
          b.isUnmounted = !0
        }, w),
        w &&
          w.pendingBranch &&
          !w.isUnmounted &&
          b.asyncDep &&
          !b.asyncResolved &&
          b.suspenseId === w.pendingId &&
          (w.deps--, w.deps === 0 && w.resolve())
    },
    We = (b, w, Ve, $e = !1, Ne = !1, Me = 0) => {
      for (let He = Me; He < b.length; He++) ut(b[He], w, Ve, $e, Ne)
    },
    z = (b) => {
      if (b.shapeFlag & 6) return z(b.component.subTree)
      if (b.shapeFlag & 128) return b.suspense.next()
      const w = y(b.anchor || b.el),
        Ve = w && w[TeleportEndKey]
      return Ve ? y(Ve) : w
    }
  let Re = !1
  const ke = (b, w, Ve) => {
      b == null
        ? w._vnode && ut(w._vnode, null, null, !0)
        : A(w._vnode || null, b, w, null, null, null, Ve),
        (w._vnode = b),
        Re || ((Re = !0), flushPreFlushCbs(), flushPostFlushCbs(), (Re = !1))
    },
    Ee = { p: A, um: ut, m: ct, r: ht, mt: je, mc: L, pc: Ke, pbc: D, n: z, o: t }
  let Ye, Ge
  return n && ([Ye, Ge] = n(Ee)), { render: ke, hydrate: Ye, createApp: createAppAPI(ke, Ye) }
}
function resolveChildrenNamespace({ type: t, props: n }, o) {
  return (o === 'svg' && t === 'foreignObject') ||
    (o === 'mathml' && t === 'annotation-xml' && n && n.encoding && n.encoding.includes('html'))
    ? void 0
    : o
}
function toggleRecurse({ effect: t, job: n }, o) {
  o ? ((t.flags |= 32), (n.flags |= 4)) : ((t.flags &= -33), (n.flags &= -5))
}
function needTransition(t, n) {
  return (!t || (t && !t.pendingBranch)) && n && !n.persisted
}
function traverseStaticChildren(t, n, o = !1) {
  const s = t.children,
    r = n.children
  if (isArray$1(s) && isArray$1(r))
    for (let i = 0; i < s.length; i++) {
      const a = s[i]
      let c = r[i]
      c.shapeFlag & 1 &&
        !c.dynamicChildren &&
        ((c.patchFlag <= 0 || c.patchFlag === 32) &&
          ((c = r[i] = cloneIfMounted(r[i])), (c.el = a.el)),
        !o && c.patchFlag !== -2 && traverseStaticChildren(a, c)),
        c.type === Text && (c.el = a.el),
        c.type === Comment && !c.el && (c.el = a.el)
    }
}
function getSequence(t) {
  const n = t.slice(),
    o = [0]
  let s, r, i, a, c
  const u = t.length
  for (s = 0; s < u; s++) {
    const g = t[s]
    if (g !== 0) {
      if (((r = o[o.length - 1]), t[r] < g)) {
        ;(n[s] = r), o.push(s)
        continue
      }
      for (i = 0, a = o.length - 1; i < a; ) (c = (i + a) >> 1), t[o[c]] < g ? (i = c + 1) : (a = c)
      g < t[o[i]] && (i > 0 && (n[s] = o[i - 1]), (o[i] = s))
    }
  }
  for (i = o.length, a = o[i - 1]; i-- > 0; ) (o[i] = a), (a = n[a])
  return o
}
function locateNonHydratedAsyncRoot(t) {
  const n = t.subTree.component
  if (n) return n.asyncDep && !n.asyncResolved ? n : locateNonHydratedAsyncRoot(n)
}
function invalidateMount(t) {
  if (t) for (let n = 0; n < t.length; n++) t[n].flags |= 8
}
const ssrContextKey = Symbol.for('v-scx'),
  useSSRContext = () => inject(ssrContextKey)
function watchEffect(t, n) {
  return doWatch(t, null, n)
}
function watchPostEffect(t, n) {
  return doWatch(t, null, { flush: 'post' })
}
function watchSyncEffect(t, n) {
  return doWatch(t, null, { flush: 'sync' })
}
function watch(t, n, o) {
  return doWatch(t, n, o)
}
function doWatch(t, n, o = EMPTY_OBJ) {
  const { immediate: s, deep: r, flush: i, once: a } = o,
    c = extend({}, o),
    u = (n && s) || (!n && i !== 'post')
  let g
  if (isInSSRComponentSetup) {
    if (i === 'sync') {
      const _ = useSSRContext()
      g = _.__watcherHandles || (_.__watcherHandles = [])
    } else if (!u) {
      const _ = () => {}
      return (_.stop = NOOP), (_.resume = NOOP), (_.pause = NOOP), _
    }
  }
  const d = currentInstance
  c.call = (_, $, A) => callWithAsyncErrorHandling(_, d, $, A)
  let v = !1
  i === 'post'
    ? (c.scheduler = (_) => {
        queuePostRenderEffect(_, d && d.suspense)
      })
    : i !== 'sync' &&
      ((v = !0),
      (c.scheduler = (_, $) => {
        $ ? _() : queueJob(_)
      })),
    (c.augmentJob = (_) => {
      n && (_.flags |= 4), v && ((_.flags |= 2), d && ((_.id = d.uid), (_.i = d)))
    })
  const y = watch$1(t, n, c)
  return isInSSRComponentSetup && (g ? g.push(y) : u && y()), y
}
function instanceWatch(t, n, o) {
  const s = this.proxy,
    r = isString(t) ? (t.includes('.') ? createPathGetter(s, t) : () => s[t]) : t.bind(s, s)
  let i
  isFunction(n) ? (i = n) : ((i = n.handler), (o = n))
  const a = setCurrentInstance(this),
    c = doWatch(r, i.bind(s), o)
  return a(), c
}
function createPathGetter(t, n) {
  const o = n.split('.')
  return () => {
    let s = t
    for (let r = 0; r < o.length && s; r++) s = s[o[r]]
    return s
  }
}
function useModel(t, n, o = EMPTY_OBJ) {
  const s = getCurrentInstance(),
    r = camelize(n),
    i = hyphenate(n),
    a = getModelModifiers(t, r),
    c = customRef((u, g) => {
      let d,
        v = EMPTY_OBJ,
        y
      return (
        watchSyncEffect(() => {
          const _ = t[r]
          hasChanged(d, _) && ((d = _), g())
        }),
        {
          get() {
            return u(), o.get ? o.get(d) : d
          },
          set(_) {
            const $ = o.set ? o.set(_) : _
            if (!hasChanged($, d) && !(v !== EMPTY_OBJ && hasChanged(_, v))) return
            const A = s.vnode.props
            ;(A &&
              (n in A || r in A || i in A) &&
              (`onUpdate:${n}` in A || `onUpdate:${r}` in A || `onUpdate:${i}` in A)) ||
              ((d = _), g()),
              s.emit(`update:${n}`, $),
              hasChanged(_, $) && hasChanged(_, v) && !hasChanged($, y) && g(),
              (v = _),
              (y = $)
          },
        }
      )
    })
  return (
    (c[Symbol.iterator] = () => {
      let u = 0
      return {
        next() {
          return u < 2 ? { value: u++ ? a || EMPTY_OBJ : c, done: !1 } : { done: !0 }
        },
      }
    }),
    c
  )
}
const getModelModifiers = (t, n) =>
  n === 'modelValue' || n === 'model-value'
    ? t.modelModifiers
    : t[`${n}Modifiers`] || t[`${camelize(n)}Modifiers`] || t[`${hyphenate(n)}Modifiers`]
function emit(t, n, ...o) {
  if (t.isUnmounted) return
  const s = t.vnode.props || EMPTY_OBJ
  let r = o
  const i = n.startsWith('update:'),
    a = i && getModelModifiers(s, n.slice(7))
  a &&
    (a.trim && (r = o.map((d) => (isString(d) ? d.trim() : d))),
    a.number && (r = o.map(looseToNumber)))
  let c,
    u = s[(c = toHandlerKey(n))] || s[(c = toHandlerKey(camelize(n)))]
  !u && i && (u = s[(c = toHandlerKey(hyphenate(n)))]), u && callWithAsyncErrorHandling(u, t, 6, r)
  const g = s[c + 'Once']
  if (g) {
    if (!t.emitted) t.emitted = {}
    else if (t.emitted[c]) return
    ;(t.emitted[c] = !0), callWithAsyncErrorHandling(g, t, 6, r)
  }
}
function normalizeEmitsOptions(t, n, o = !1) {
  const s = n.emitsCache,
    r = s.get(t)
  if (r !== void 0) return r
  const i = t.emits
  let a = {},
    c = !1
  if (!isFunction(t)) {
    const u = (g) => {
      const d = normalizeEmitsOptions(g, n, !0)
      d && ((c = !0), extend(a, d))
    }
    !o && n.mixins.length && n.mixins.forEach(u),
      t.extends && u(t.extends),
      t.mixins && t.mixins.forEach(u)
  }
  return !i && !c
    ? (isObject(t) && s.set(t, null), null)
    : (isArray$1(i) ? i.forEach((u) => (a[u] = null)) : extend(a, i), isObject(t) && s.set(t, a), a)
}
function isEmitListener(t, n) {
  return !t || !isOn(n)
    ? !1
    : ((n = n.slice(2).replace(/Once$/, '')),
      hasOwn(t, n[0].toLowerCase() + n.slice(1)) || hasOwn(t, hyphenate(n)) || hasOwn(t, n))
}
function markAttrsAccessed() {}
function renderComponentRoot(t) {
  const {
      type: n,
      vnode: o,
      proxy: s,
      withProxy: r,
      propsOptions: [i],
      slots: a,
      attrs: c,
      emit: u,
      render: g,
      renderCache: d,
      props: v,
      data: y,
      setupState: _,
      ctx: $,
      inheritAttrs: A,
    } = t,
    k = setCurrentRenderingInstance(t)
  let O, j
  try {
    if (o.shapeFlag & 4) {
      const P = r || s,
        F = P
      ;(O = normalizeVNode(g.call(F, P, d, v, _, y, $))), (j = c)
    } else {
      const P = n
      ;(O = normalizeVNode(P.length > 1 ? P(v, { attrs: c, slots: a, emit: u }) : P(v, null))),
        (j = n.props ? c : getFunctionalFallthrough(c))
    }
  } catch (P) {
    ;(blockStack.length = 0), handleError(P, t, 1), (O = createVNode(Comment))
  }
  let B = O
  if (j && A !== !1) {
    const P = Object.keys(j),
      { shapeFlag: F } = B
    P.length &&
      F & 7 &&
      (i && P.some(isModelListener) && (j = filterModelListeners(j, i)),
      (B = cloneVNode(B, j, !1, !0)))
  }
  return (
    o.dirs &&
      ((B = cloneVNode(B, null, !1, !0)), (B.dirs = B.dirs ? B.dirs.concat(o.dirs) : o.dirs)),
    o.transition && setTransitionHooks(B, o.transition),
    (O = B),
    setCurrentRenderingInstance(k),
    O
  )
}
function filterSingleRoot(t, n = !0) {
  let o
  for (let s = 0; s < t.length; s++) {
    const r = t[s]
    if (isVNode(r)) {
      if (r.type !== Comment || r.children === 'v-if') {
        if (o) return
        o = r
      }
    } else return
  }
  return o
}
const getFunctionalFallthrough = (t) => {
    let n
    for (const o in t) (o === 'class' || o === 'style' || isOn(o)) && ((n || (n = {}))[o] = t[o])
    return n
  },
  filterModelListeners = (t, n) => {
    const o = {}
    for (const s in t) (!isModelListener(s) || !(s.slice(9) in n)) && (o[s] = t[s])
    return o
  }
function shouldUpdateComponent(t, n, o) {
  const { props: s, children: r, component: i } = t,
    { props: a, children: c, patchFlag: u } = n,
    g = i.emitsOptions
  if (n.dirs || n.transition) return !0
  if (o && u >= 0) {
    if (u & 1024) return !0
    if (u & 16) return s ? hasPropsChanged(s, a, g) : !!a
    if (u & 8) {
      const d = n.dynamicProps
      for (let v = 0; v < d.length; v++) {
        const y = d[v]
        if (a[y] !== s[y] && !isEmitListener(g, y)) return !0
      }
    }
  } else
    return (r || c) && (!c || !c.$stable)
      ? !0
      : s === a
        ? !1
        : s
          ? a
            ? hasPropsChanged(s, a, g)
            : !0
          : !!a
  return !1
}
function hasPropsChanged(t, n, o) {
  const s = Object.keys(n)
  if (s.length !== Object.keys(t).length) return !0
  for (let r = 0; r < s.length; r++) {
    const i = s[r]
    if (n[i] !== t[i] && !isEmitListener(o, i)) return !0
  }
  return !1
}
function updateHOCHostEl({ vnode: t, parent: n }, o) {
  for (; n; ) {
    const s = n.subTree
    if ((s.suspense && s.suspense.activeBranch === t && (s.el = t.el), s === t))
      ((t = n.vnode).el = o), (n = n.parent)
    else break
  }
}
const isSuspense = (t) => t.__isSuspense
let suspenseId = 0
const SuspenseImpl = {
    name: 'Suspense',
    __isSuspense: !0,
    process(t, n, o, s, r, i, a, c, u, g) {
      if (t == null) mountSuspense(n, o, s, r, i, a, c, u, g)
      else {
        if (i && i.deps > 0 && !t.suspense.isInFallback) {
          ;(n.suspense = t.suspense), (n.suspense.vnode = n), (n.el = t.el)
          return
        }
        patchSuspense(t, n, o, s, r, a, c, u, g)
      }
    },
    hydrate: hydrateSuspense,
    normalize: normalizeSuspenseChildren,
  },
  Suspense = SuspenseImpl
function triggerEvent(t, n) {
  const o = t.props && t.props[n]
  isFunction(o) && o()
}
function mountSuspense(t, n, o, s, r, i, a, c, u) {
  const {
      p: g,
      o: { createElement: d },
    } = u,
    v = d('div'),
    y = (t.suspense = createSuspenseBoundary(t, r, s, n, v, o, i, a, c, u))
  g(null, (y.pendingBranch = t.ssContent), v, null, s, y, i, a),
    y.deps > 0
      ? (triggerEvent(t, 'onPending'),
        triggerEvent(t, 'onFallback'),
        g(null, t.ssFallback, n, o, s, null, i, a),
        setActiveBranch(y, t.ssFallback))
      : y.resolve(!1, !0)
}
function patchSuspense(t, n, o, s, r, i, a, c, { p: u, um: g, o: { createElement: d } }) {
  const v = (n.suspense = t.suspense)
  ;(v.vnode = n), (n.el = t.el)
  const y = n.ssContent,
    _ = n.ssFallback,
    { activeBranch: $, pendingBranch: A, isInFallback: k, isHydrating: O } = v
  if (A)
    (v.pendingBranch = y),
      isSameVNodeType(y, A)
        ? (u(A, y, v.hiddenContainer, null, r, v, i, a, c),
          v.deps <= 0
            ? v.resolve()
            : k && (O || (u($, _, o, s, r, null, i, a, c), setActiveBranch(v, _))))
        : ((v.pendingId = suspenseId++),
          O ? ((v.isHydrating = !1), (v.activeBranch = A)) : g(A, r, v),
          (v.deps = 0),
          (v.effects.length = 0),
          (v.hiddenContainer = d('div')),
          k
            ? (u(null, y, v.hiddenContainer, null, r, v, i, a, c),
              v.deps <= 0 ? v.resolve() : (u($, _, o, s, r, null, i, a, c), setActiveBranch(v, _)))
            : $ && isSameVNodeType(y, $)
              ? (u($, y, o, s, r, v, i, a, c), v.resolve(!0))
              : (u(null, y, v.hiddenContainer, null, r, v, i, a, c), v.deps <= 0 && v.resolve()))
  else if ($ && isSameVNodeType(y, $)) u($, y, o, s, r, v, i, a, c), setActiveBranch(v, y)
  else if (
    (triggerEvent(n, 'onPending'),
    (v.pendingBranch = y),
    y.shapeFlag & 512 ? (v.pendingId = y.component.suspenseId) : (v.pendingId = suspenseId++),
    u(null, y, v.hiddenContainer, null, r, v, i, a, c),
    v.deps <= 0)
  )
    v.resolve()
  else {
    const { timeout: j, pendingId: B } = v
    j > 0
      ? setTimeout(() => {
          v.pendingId === B && v.fallback(_)
        }, j)
      : j === 0 && v.fallback(_)
  }
}
function createSuspenseBoundary(t, n, o, s, r, i, a, c, u, g, d = !1) {
  const {
    p: v,
    m: y,
    um: _,
    n: $,
    o: { parentNode: A, remove: k },
  } = g
  let O
  const j = isVNodeSuspensible(t)
  j && n && n.pendingBranch && ((O = n.pendingId), n.deps++)
  const B = t.props ? toNumber(t.props.timeout) : void 0,
    P = i,
    F = {
      vnode: t,
      parent: n,
      parentComponent: o,
      namespace: a,
      container: s,
      hiddenContainer: r,
      deps: 0,
      pendingId: suspenseId++,
      timeout: typeof B == 'number' ? B : -1,
      activeBranch: null,
      pendingBranch: null,
      isInFallback: !d,
      isHydrating: d,
      isUnmounted: !1,
      effects: [],
      resolve(Be = !1, Se = !1) {
        const {
          vnode: L,
          activeBranch: R,
          pendingBranch: D,
          pendingId: Te,
          effects: K,
          parentComponent: De,
          container: je,
        } = F
        let Pe = !1
        F.isHydrating
          ? (F.isHydrating = !1)
          : Be ||
            ((Pe = R && D.transition && D.transition.mode === 'out-in'),
            Pe &&
              (R.transition.afterLeave = () => {
                Te === F.pendingId && (y(D, je, i === P ? $(R) : i, 0), queuePostFlushCb(K))
              }),
            R && (A(R.el) === je && (i = $(R)), _(R, De, F, !0)),
            Pe || y(D, je, i, 0)),
          setActiveBranch(F, D),
          (F.pendingBranch = null),
          (F.isInFallback = !1)
        let xe = F.parent,
          Ze = !1
        for (; xe; ) {
          if (xe.pendingBranch) {
            xe.effects.push(...K), (Ze = !0)
            break
          }
          xe = xe.parent
        }
        !Ze && !Pe && queuePostFlushCb(K),
          (F.effects = []),
          j &&
            n &&
            n.pendingBranch &&
            O === n.pendingId &&
            (n.deps--, n.deps === 0 && !Se && n.resolve()),
          triggerEvent(L, 'onResolve')
      },
      fallback(Be) {
        if (!F.pendingBranch) return
        const { vnode: Se, activeBranch: L, parentComponent: R, container: D, namespace: Te } = F
        triggerEvent(Se, 'onFallback')
        const K = $(L),
          De = () => {
            F.isInFallback && (v(null, Be, D, K, R, null, Te, c, u), setActiveBranch(F, Be))
          },
          je = Be.transition && Be.transition.mode === 'out-in'
        je && (L.transition.afterLeave = De), (F.isInFallback = !0), _(L, R, null, !0), je || De()
      },
      move(Be, Se, L) {
        F.activeBranch && y(F.activeBranch, Be, Se, L), (F.container = Be)
      },
      next() {
        return F.activeBranch && $(F.activeBranch)
      },
      registerDep(Be, Se, L) {
        const R = !!F.pendingBranch
        R && F.deps++
        const D = Be.vnode.el
        Be.asyncDep
          .catch((Te) => {
            handleError(Te, Be, 0)
          })
          .then((Te) => {
            if (Be.isUnmounted || F.isUnmounted || F.pendingId !== Be.suspenseId) return
            Be.asyncResolved = !0
            const { vnode: K } = Be
            handleSetupResult(Be, Te, !1), D && (K.el = D)
            const De = !D && Be.subTree.el
            Se(Be, K, A(D || Be.subTree.el), D ? null : $(Be.subTree), F, a, L),
              De && k(De),
              updateHOCHostEl(Be, K.el),
              R && --F.deps === 0 && F.resolve()
          })
      },
      unmount(Be, Se) {
        ;(F.isUnmounted = !0),
          F.activeBranch && _(F.activeBranch, o, Be, Se),
          F.pendingBranch && _(F.pendingBranch, o, Be, Se)
      },
    }
  return F
}
function hydrateSuspense(t, n, o, s, r, i, a, c, u) {
  const g = (n.suspense = createSuspenseBoundary(
      n,
      s,
      o,
      t.parentNode,
      document.createElement('div'),
      null,
      r,
      i,
      a,
      c,
      !0,
    )),
    d = u(t, (g.pendingBranch = n.ssContent), o, g, i, a)
  return g.deps === 0 && g.resolve(!1, !0), d
}
function normalizeSuspenseChildren(t) {
  const { shapeFlag: n, children: o } = t,
    s = n & 32
  ;(t.ssContent = normalizeSuspenseSlot(s ? o.default : o)),
    (t.ssFallback = s ? normalizeSuspenseSlot(o.fallback) : createVNode(Comment))
}
function normalizeSuspenseSlot(t) {
  let n
  if (isFunction(t)) {
    const o = isBlockTreeEnabled && t._c
    o && ((t._d = !1), openBlock()), (t = t()), o && ((t._d = !0), (n = currentBlock), closeBlock())
  }
  return (
    isArray$1(t) && (t = filterSingleRoot(t)),
    (t = normalizeVNode(t)),
    n && !t.dynamicChildren && (t.dynamicChildren = n.filter((o) => o !== t)),
    t
  )
}
function queueEffectWithSuspense(t, n) {
  n && n.pendingBranch
    ? isArray$1(t)
      ? n.effects.push(...t)
      : n.effects.push(t)
    : queuePostFlushCb(t)
}
function setActiveBranch(t, n) {
  t.activeBranch = n
  const { vnode: o, parentComponent: s } = t
  let r = n.el
  for (; !r && n.component; ) (n = n.component.subTree), (r = n.el)
  ;(o.el = r), s && s.subTree === o && ((s.vnode.el = r), updateHOCHostEl(s, r))
}
function isVNodeSuspensible(t) {
  const n = t.props && t.props.suspensible
  return n != null && n !== !1
}
const Fragment = Symbol.for('v-fgt'),
  Text = Symbol.for('v-txt'),
  Comment = Symbol.for('v-cmt'),
  Static = Symbol.for('v-stc'),
  blockStack = []
let currentBlock = null
function openBlock(t = !1) {
  blockStack.push((currentBlock = t ? null : []))
}
function closeBlock() {
  blockStack.pop(), (currentBlock = blockStack[blockStack.length - 1] || null)
}
let isBlockTreeEnabled = 1
function setBlockTracking(t, n = !1) {
  ;(isBlockTreeEnabled += t), t < 0 && currentBlock && n && (currentBlock.hasOnce = !0)
}
function setupBlock(t) {
  return (
    (t.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null),
    closeBlock(),
    isBlockTreeEnabled > 0 && currentBlock && currentBlock.push(t),
    t
  )
}
function createElementBlock(t, n, o, s, r, i) {
  return setupBlock(createBaseVNode(t, n, o, s, r, i, !0))
}
function createBlock(t, n, o, s, r) {
  return setupBlock(createVNode(t, n, o, s, r, !0))
}
function isVNode(t) {
  return t ? t.__v_isVNode === !0 : !1
}
function isSameVNodeType(t, n) {
  return t.type === n.type && t.key === n.key
}
function transformVNodeArgs(t) {}
const normalizeKey = ({ key: t }) => t ?? null,
  normalizeRef = ({ ref: t, ref_key: n, ref_for: o }) => (
    typeof t == 'number' && (t = '' + t),
    t != null
      ? isString(t) || isRef(t) || isFunction(t)
        ? { i: currentRenderingInstance, r: t, k: n, f: !!o }
        : t
      : null
  )
function createBaseVNode(
  t,
  n = null,
  o = null,
  s = 0,
  r = null,
  i = t === Fragment ? 0 : 1,
  a = !1,
  c = !1,
) {
  const u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: n,
    key: n && normalizeKey(n),
    ref: n && normalizeRef(n),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children: o,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance,
  }
  return (
    c
      ? (normalizeChildren(u, o), i & 128 && t.normalize(u))
      : o && (u.shapeFlag |= isString(o) ? 8 : 16),
    isBlockTreeEnabled > 0 &&
      !a &&
      currentBlock &&
      (u.patchFlag > 0 || i & 6) &&
      u.patchFlag !== 32 &&
      currentBlock.push(u),
    u
  )
}
const createVNode = _createVNode
function _createVNode(t, n = null, o = null, s = 0, r = null, i = !1) {
  if (((!t || t === NULL_DYNAMIC_COMPONENT) && (t = Comment), isVNode(t))) {
    const c = cloneVNode(t, n, !0)
    return (
      o && normalizeChildren(c, o),
      isBlockTreeEnabled > 0 &&
        !i &&
        currentBlock &&
        (c.shapeFlag & 6 ? (currentBlock[currentBlock.indexOf(t)] = c) : currentBlock.push(c)),
      (c.patchFlag = -2),
      c
    )
  }
  if ((isClassComponent(t) && (t = t.__vccOpts), n)) {
    n = guardReactiveProps(n)
    let { class: c, style: u } = n
    c && !isString(c) && (n.class = normalizeClass(c)),
      isObject(u) &&
        (isProxy(u) && !isArray$1(u) && (u = extend({}, u)), (n.style = normalizeStyle(u)))
  }
  const a = isString(t)
    ? 1
    : isSuspense(t)
      ? 128
      : isTeleport(t)
        ? 64
        : isObject(t)
          ? 4
          : isFunction(t)
            ? 2
            : 0
  return createBaseVNode(t, n, o, s, r, a, i, !0)
}
function guardReactiveProps(t) {
  return t ? (isProxy(t) || isInternalObject(t) ? extend({}, t) : t) : null
}
function cloneVNode(t, n, o = !1, s = !1) {
  const { props: r, ref: i, patchFlag: a, children: c, transition: u } = t,
    g = n ? mergeProps(r || {}, n) : r,
    d = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: t.type,
      props: g,
      key: g && normalizeKey(g),
      ref:
        n && n.ref
          ? o && i
            ? isArray$1(i)
              ? i.concat(normalizeRef(n))
              : [i, normalizeRef(n)]
            : normalizeRef(n)
          : i,
      scopeId: t.scopeId,
      slotScopeIds: t.slotScopeIds,
      children: c,
      target: t.target,
      targetStart: t.targetStart,
      targetAnchor: t.targetAnchor,
      staticCount: t.staticCount,
      shapeFlag: t.shapeFlag,
      patchFlag: n && t.type !== Fragment ? (a === -1 ? 16 : a | 16) : a,
      dynamicProps: t.dynamicProps,
      dynamicChildren: t.dynamicChildren,
      appContext: t.appContext,
      dirs: t.dirs,
      transition: u,
      component: t.component,
      suspense: t.suspense,
      ssContent: t.ssContent && cloneVNode(t.ssContent),
      ssFallback: t.ssFallback && cloneVNode(t.ssFallback),
      el: t.el,
      anchor: t.anchor,
      ctx: t.ctx,
      ce: t.ce,
    }
  return u && s && setTransitionHooks(d, u.clone(d)), d
}
function createTextVNode(t = ' ', n = 0) {
  return createVNode(Text, null, t, n)
}
function createStaticVNode(t, n) {
  const o = createVNode(Static, null, t)
  return (o.staticCount = n), o
}
function createCommentVNode(t = '', n = !1) {
  return n ? (openBlock(), createBlock(Comment, null, t)) : createVNode(Comment, null, t)
}
function normalizeVNode(t) {
  return t == null || typeof t == 'boolean'
    ? createVNode(Comment)
    : isArray$1(t)
      ? createVNode(Fragment, null, t.slice())
      : isVNode(t)
        ? cloneIfMounted(t)
        : createVNode(Text, null, String(t))
}
function cloneIfMounted(t) {
  return (t.el === null && t.patchFlag !== -1) || t.memo ? t : cloneVNode(t)
}
function normalizeChildren(t, n) {
  let o = 0
  const { shapeFlag: s } = t
  if (n == null) n = null
  else if (isArray$1(n)) o = 16
  else if (typeof n == 'object')
    if (s & 65) {
      const r = n.default
      r && (r._c && (r._d = !1), normalizeChildren(t, r()), r._c && (r._d = !0))
      return
    } else {
      o = 32
      const r = n._
      !r && !isInternalObject(n)
        ? (n._ctx = currentRenderingInstance)
        : r === 3 &&
          currentRenderingInstance &&
          (currentRenderingInstance.slots._ === 1 ? (n._ = 1) : ((n._ = 2), (t.patchFlag |= 1024)))
    }
  else
    isFunction(n)
      ? ((n = { default: n, _ctx: currentRenderingInstance }), (o = 32))
      : ((n = String(n)), s & 64 ? ((o = 16), (n = [createTextVNode(n)])) : (o = 8))
  ;(t.children = n), (t.shapeFlag |= o)
}
function mergeProps(...t) {
  const n = {}
  for (let o = 0; o < t.length; o++) {
    const s = t[o]
    for (const r in s)
      if (r === 'class') n.class !== s.class && (n.class = normalizeClass([n.class, s.class]))
      else if (r === 'style') n.style = normalizeStyle([n.style, s.style])
      else if (isOn(r)) {
        const i = n[r],
          a = s[r]
        a && i !== a && !(isArray$1(i) && i.includes(a)) && (n[r] = i ? [].concat(i, a) : a)
      } else r !== '' && (n[r] = s[r])
  }
  return n
}
function invokeVNodeHook(t, n, o, s = null) {
  callWithAsyncErrorHandling(t, n, 7, [o, s])
}
const emptyAppContext = createAppContext()
let uid = 0
function createComponentInstance(t, n, o) {
  const s = t.type,
    r = (n ? n.appContext : t.appContext) || emptyAppContext,
    i = {
      uid: uid++,
      vnode: t,
      type: s,
      parent: n,
      appContext: r,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      job: null,
      scope: new EffectScope(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: n ? n.provides : Object.create(r.provides),
      ids: n ? n.ids : ['', 0, 0],
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: normalizePropsOptions(s, r),
      emitsOptions: normalizeEmitsOptions(s, r),
      emit: null,
      emitted: null,
      propsDefaults: EMPTY_OBJ,
      inheritAttrs: s.inheritAttrs,
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      suspense: o,
      suspenseId: o ? o.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null,
    }
  return (
    (i.ctx = { _: i }), (i.root = n ? n.root : i), (i.emit = emit.bind(null, i)), t.ce && t.ce(i), i
  )
}
let currentInstance = null
const getCurrentInstance = () => currentInstance || currentRenderingInstance
let internalSetCurrentInstance, setInSSRSetupState
{
  const t = getGlobalThis(),
    n = (o, s) => {
      let r
      return (
        (r = t[o]) || (r = t[o] = []),
        r.push(s),
        (i) => {
          r.length > 1 ? r.forEach((a) => a(i)) : r[0](i)
        }
      )
    }
  ;(internalSetCurrentInstance = n('__VUE_INSTANCE_SETTERS__', (o) => (currentInstance = o))),
    (setInSSRSetupState = n('__VUE_SSR_SETTERS__', (o) => (isInSSRComponentSetup = o)))
}
const setCurrentInstance = (t) => {
    const n = currentInstance
    return (
      internalSetCurrentInstance(t),
      t.scope.on(),
      () => {
        t.scope.off(), internalSetCurrentInstance(n)
      }
    )
  },
  unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off(), internalSetCurrentInstance(null)
  }
function isStatefulComponent(t) {
  return t.vnode.shapeFlag & 4
}
let isInSSRComponentSetup = !1
function setupComponent(t, n = !1, o = !1) {
  n && setInSSRSetupState(n)
  const { props: s, children: r } = t.vnode,
    i = isStatefulComponent(t)
  initProps(t, s, i, n), initSlots(t, r, o || n)
  const a = i ? setupStatefulComponent(t, n) : void 0
  return n && setInSSRSetupState(!1), a
}
function setupStatefulComponent(t, n) {
  const o = t.type
  ;(t.accessCache = Object.create(null)), (t.proxy = new Proxy(t.ctx, PublicInstanceProxyHandlers))
  const { setup: s } = o
  if (s) {
    pauseTracking()
    const r = (t.setupContext = s.length > 1 ? createSetupContext(t) : null),
      i = setCurrentInstance(t),
      a = callWithErrorHandling(s, t, 0, [t.props, r]),
      c = isPromise(a)
    if ((resetTracking(), i(), (c || t.sp) && !isAsyncWrapper(t) && markAsyncBoundary(t), c)) {
      if ((a.then(unsetCurrentInstance, unsetCurrentInstance), n))
        return a
          .then((u) => {
            handleSetupResult(t, u, n)
          })
          .catch((u) => {
            handleError(u, t, 0)
          })
      t.asyncDep = a
    } else handleSetupResult(t, a, n)
  } else finishComponentSetup(t, n)
}
function handleSetupResult(t, n, o) {
  isFunction(n)
    ? t.type.__ssrInlineRender
      ? (t.ssrRender = n)
      : (t.render = n)
    : isObject(n) && (t.setupState = proxyRefs(n)),
    finishComponentSetup(t, o)
}
let compile$1, installWithProxy
function registerRuntimeCompiler(t) {
  ;(compile$1 = t),
    (installWithProxy = (n) => {
      n.render._rc && (n.withProxy = new Proxy(n.ctx, RuntimeCompiledPublicInstanceProxyHandlers))
    })
}
const isRuntimeOnly = () => !compile$1
function finishComponentSetup(t, n, o) {
  const s = t.type
  if (!t.render) {
    if (!n && compile$1 && !s.render) {
      const r = s.template || resolveMergedOptions(t).template
      if (r) {
        const { isCustomElement: i, compilerOptions: a } = t.appContext.config,
          { delimiters: c, compilerOptions: u } = s,
          g = extend(extend({ isCustomElement: i, delimiters: c }, a), u)
        s.render = compile$1(r, g)
      }
    }
    ;(t.render = s.render || NOOP), installWithProxy && installWithProxy(t)
  }
  {
    const r = setCurrentInstance(t)
    pauseTracking()
    try {
      applyOptions(t)
    } finally {
      resetTracking(), r()
    }
  }
}
const attrsProxyHandlers = {
  get(t, n) {
    return track(t, 'get', ''), t[n]
  },
}
function createSetupContext(t) {
  const n = (o) => {
    t.exposed = o || {}
  }
  return { attrs: new Proxy(t.attrs, attrsProxyHandlers), slots: t.slots, emit: t.emit, expose: n }
}
function getComponentPublicInstance(t) {
  return t.exposed
    ? t.exposeProxy ||
        (t.exposeProxy = new Proxy(proxyRefs(markRaw(t.exposed)), {
          get(n, o) {
            if (o in n) return n[o]
            if (o in publicPropertiesMap) return publicPropertiesMap[o](t)
          },
          has(n, o) {
            return o in n || o in publicPropertiesMap
          },
        }))
    : t.proxy
}
const classifyRE = /(?:^|[-_])(\w)/g,
  classify = (t) => t.replace(classifyRE, (n) => n.toUpperCase()).replace(/[-_]/g, '')
function getComponentName(t, n = !0) {
  return isFunction(t) ? t.displayName || t.name : t.name || (n && t.__name)
}
function formatComponentName(t, n, o = !1) {
  let s = getComponentName(n)
  if (!s && n.__file) {
    const r = n.__file.match(/([^/\\]+)\.\w+$/)
    r && (s = r[1])
  }
  if (!s && t && t.parent) {
    const r = (i) => {
      for (const a in i) if (i[a] === n) return a
    }
    s = r(t.components || t.parent.type.components) || r(t.appContext.components)
  }
  return s ? classify(s) : o ? 'App' : 'Anonymous'
}
function isClassComponent(t) {
  return isFunction(t) && '__vccOpts' in t
}
const computed = (t, n) => computed$1(t, n, isInSSRComponentSetup)
function h$1(t, n, o) {
  const s = arguments.length
  return s === 2
    ? isObject(n) && !isArray$1(n)
      ? isVNode(n)
        ? createVNode(t, null, [n])
        : createVNode(t, n)
      : createVNode(t, null, n)
    : (s > 3 ? (o = Array.prototype.slice.call(arguments, 2)) : s === 3 && isVNode(o) && (o = [o]),
      createVNode(t, n, o))
}
function initCustomFormatter() {}
function withMemo(t, n, o, s) {
  const r = o[s]
  if (r && isMemoSame(r, t)) return r
  const i = n()
  return (i.memo = t.slice()), (i.cacheIndex = s), (o[s] = i)
}
function isMemoSame(t, n) {
  const o = t.memo
  if (o.length != n.length) return !1
  for (let s = 0; s < o.length; s++) if (hasChanged(o[s], n[s])) return !1
  return isBlockTreeEnabled > 0 && currentBlock && currentBlock.push(t), !0
}
const version = '3.5.17',
  warn = NOOP,
  ErrorTypeStrings = ErrorTypeStrings$1,
  devtools = devtools$1,
  setDevtoolsHook = setDevtoolsHook$1,
  _ssrUtils = {
    createComponentInstance,
    setupComponent,
    renderComponentRoot,
    setCurrentRenderingInstance,
    isVNode,
    normalizeVNode,
    getComponentPublicInstance,
    ensureValidVNode,
    pushWarningContext,
    popWarningContext,
  },
  ssrUtils = _ssrUtils,
  resolveFilter = null,
  compatUtils = null,
  DeprecationTypes = null
/**
 * @vue/runtime-dom v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let policy
const tt = typeof window < 'u' && window.trustedTypes
if (tt)
  try {
    policy = tt.createPolicy('vue', { createHTML: (t) => t })
  } catch {}
const unsafeToTrustedHTML = policy ? (t) => policy.createHTML(t) : (t) => t,
  svgNS = 'http://www.w3.org/2000/svg',
  mathmlNS = 'http://www.w3.org/1998/Math/MathML',
  doc = typeof document < 'u' ? document : null,
  templateContainer = doc && doc.createElement('template'),
  nodeOps = {
    insert: (t, n, o) => {
      n.insertBefore(t, o || null)
    },
    remove: (t) => {
      const n = t.parentNode
      n && n.removeChild(t)
    },
    createElement: (t, n, o, s) => {
      const r =
        n === 'svg'
          ? doc.createElementNS(svgNS, t)
          : n === 'mathml'
            ? doc.createElementNS(mathmlNS, t)
            : o
              ? doc.createElement(t, { is: o })
              : doc.createElement(t)
      return t === 'select' && s && s.multiple != null && r.setAttribute('multiple', s.multiple), r
    },
    createText: (t) => doc.createTextNode(t),
    createComment: (t) => doc.createComment(t),
    setText: (t, n) => {
      t.nodeValue = n
    },
    setElementText: (t, n) => {
      t.textContent = n
    },
    parentNode: (t) => t.parentNode,
    nextSibling: (t) => t.nextSibling,
    querySelector: (t) => doc.querySelector(t),
    setScopeId(t, n) {
      t.setAttribute(n, '')
    },
    insertStaticContent(t, n, o, s, r, i) {
      const a = o ? o.previousSibling : n.lastChild
      if (r && (r === i || r.nextSibling))
        for (; n.insertBefore(r.cloneNode(!0), o), !(r === i || !(r = r.nextSibling)); );
      else {
        templateContainer.innerHTML = unsafeToTrustedHTML(
          s === 'svg' ? `<svg>${t}</svg>` : s === 'mathml' ? `<math>${t}</math>` : t,
        )
        const c = templateContainer.content
        if (s === 'svg' || s === 'mathml') {
          const u = c.firstChild
          for (; u.firstChild; ) c.appendChild(u.firstChild)
          c.removeChild(u)
        }
        n.insertBefore(c, o)
      }
      return [a ? a.nextSibling : n.firstChild, o ? o.previousSibling : n.lastChild]
    },
  },
  TRANSITION = 'transition',
  ANIMATION = 'animation',
  vtcKey = Symbol('_vtc'),
  DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: { type: Boolean, default: !0 },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String,
  },
  TransitionPropsValidators = extend(
    {},
    BaseTransitionPropsValidators,
    DOMTransitionPropsValidators,
  ),
  decorate$1 = (t) => ((t.displayName = 'Transition'), (t.props = TransitionPropsValidators), t),
  Transition = decorate$1((t, { slots: n }) => h$1(BaseTransition, resolveTransitionProps(t), n)),
  callHook = (t, n = []) => {
    isArray$1(t) ? t.forEach((o) => o(...n)) : t && t(...n)
  },
  hasExplicitCallback = (t) =>
    t ? (isArray$1(t) ? t.some((n) => n.length > 1) : t.length > 1) : !1
function resolveTransitionProps(t) {
  const n = {}
  for (const K in t) K in DOMTransitionPropsValidators || (n[K] = t[K])
  if (t.css === !1) return n
  const {
      name: o = 'v',
      type: s,
      duration: r,
      enterFromClass: i = `${o}-enter-from`,
      enterActiveClass: a = `${o}-enter-active`,
      enterToClass: c = `${o}-enter-to`,
      appearFromClass: u = i,
      appearActiveClass: g = a,
      appearToClass: d = c,
      leaveFromClass: v = `${o}-leave-from`,
      leaveActiveClass: y = `${o}-leave-active`,
      leaveToClass: _ = `${o}-leave-to`,
    } = t,
    $ = normalizeDuration(r),
    A = $ && $[0],
    k = $ && $[1],
    {
      onBeforeEnter: O,
      onEnter: j,
      onEnterCancelled: B,
      onLeave: P,
      onLeaveCancelled: F,
      onBeforeAppear: Be = O,
      onAppear: Se = j,
      onAppearCancelled: L = B,
    } = n,
    R = (K, De, je, Pe) => {
      ;(K._enterCancelled = Pe),
        removeTransitionClass(K, De ? d : c),
        removeTransitionClass(K, De ? g : a),
        je && je()
    },
    D = (K, De) => {
      ;(K._isLeaving = !1),
        removeTransitionClass(K, v),
        removeTransitionClass(K, _),
        removeTransitionClass(K, y),
        De && De()
    },
    Te = (K) => (De, je) => {
      const Pe = K ? Se : j,
        xe = () => R(De, K, je)
      callHook(Pe, [De, xe]),
        nextFrame(() => {
          removeTransitionClass(De, K ? u : i),
            addTransitionClass(De, K ? d : c),
            hasExplicitCallback(Pe) || whenTransitionEnds(De, s, A, xe)
        })
    }
  return extend(n, {
    onBeforeEnter(K) {
      callHook(O, [K]), addTransitionClass(K, i), addTransitionClass(K, a)
    },
    onBeforeAppear(K) {
      callHook(Be, [K]), addTransitionClass(K, u), addTransitionClass(K, g)
    },
    onEnter: Te(!1),
    onAppear: Te(!0),
    onLeave(K, De) {
      K._isLeaving = !0
      const je = () => D(K, De)
      addTransitionClass(K, v),
        K._enterCancelled
          ? (addTransitionClass(K, y), forceReflow())
          : (forceReflow(), addTransitionClass(K, y)),
        nextFrame(() => {
          K._isLeaving &&
            (removeTransitionClass(K, v),
            addTransitionClass(K, _),
            hasExplicitCallback(P) || whenTransitionEnds(K, s, k, je))
        }),
        callHook(P, [K, je])
    },
    onEnterCancelled(K) {
      R(K, !1, void 0, !0), callHook(B, [K])
    },
    onAppearCancelled(K) {
      R(K, !0, void 0, !0), callHook(L, [K])
    },
    onLeaveCancelled(K) {
      D(K), callHook(F, [K])
    },
  })
}
function normalizeDuration(t) {
  if (t == null) return null
  if (isObject(t)) return [NumberOf(t.enter), NumberOf(t.leave)]
  {
    const n = NumberOf(t)
    return [n, n]
  }
}
function NumberOf(t) {
  return toNumber(t)
}
function addTransitionClass(t, n) {
  n.split(/\s+/).forEach((o) => o && t.classList.add(o)),
    (t[vtcKey] || (t[vtcKey] = new Set())).add(n)
}
function removeTransitionClass(t, n) {
  n.split(/\s+/).forEach((s) => s && t.classList.remove(s))
  const o = t[vtcKey]
  o && (o.delete(n), o.size || (t[vtcKey] = void 0))
}
function nextFrame(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t)
  })
}
let endId = 0
function whenTransitionEnds(t, n, o, s) {
  const r = (t._endId = ++endId),
    i = () => {
      r === t._endId && s()
    }
  if (o != null) return setTimeout(i, o)
  const { type: a, timeout: c, propCount: u } = getTransitionInfo(t, n)
  if (!a) return s()
  const g = a + 'end'
  let d = 0
  const v = () => {
      t.removeEventListener(g, y), i()
    },
    y = (_) => {
      _.target === t && ++d >= u && v()
    }
  setTimeout(() => {
    d < u && v()
  }, c + 1),
    t.addEventListener(g, y)
}
function getTransitionInfo(t, n) {
  const o = window.getComputedStyle(t),
    s = ($) => (o[$] || '').split(', '),
    r = s(`${TRANSITION}Delay`),
    i = s(`${TRANSITION}Duration`),
    a = getTimeout(r, i),
    c = s(`${ANIMATION}Delay`),
    u = s(`${ANIMATION}Duration`),
    g = getTimeout(c, u)
  let d = null,
    v = 0,
    y = 0
  n === TRANSITION
    ? a > 0 && ((d = TRANSITION), (v = a), (y = i.length))
    : n === ANIMATION
      ? g > 0 && ((d = ANIMATION), (v = g), (y = u.length))
      : ((v = Math.max(a, g)),
        (d = v > 0 ? (a > g ? TRANSITION : ANIMATION) : null),
        (y = d ? (d === TRANSITION ? i.length : u.length) : 0))
  const _ = d === TRANSITION && /\b(transform|all)(,|$)/.test(s(`${TRANSITION}Property`).toString())
  return { type: d, timeout: v, propCount: y, hasTransform: _ }
}
function getTimeout(t, n) {
  for (; t.length < n.length; ) t = t.concat(t)
  return Math.max(...n.map((o, s) => toMs(o) + toMs(t[s])))
}
function toMs(t) {
  return t === 'auto' ? 0 : Number(t.slice(0, -1).replace(',', '.')) * 1e3
}
function forceReflow() {
  return document.body.offsetHeight
}
function patchClass(t, n, o) {
  const s = t[vtcKey]
  s && (n = (n ? [n, ...s] : [...s]).join(' ')),
    n == null ? t.removeAttribute('class') : o ? t.setAttribute('class', n) : (t.className = n)
}
const vShowOriginalDisplay = Symbol('_vod'),
  vShowHidden = Symbol('_vsh'),
  vShow = {
    beforeMount(t, { value: n }, { transition: o }) {
      ;(t[vShowOriginalDisplay] = t.style.display === 'none' ? '' : t.style.display),
        o && n ? o.beforeEnter(t) : setDisplay(t, n)
    },
    mounted(t, { value: n }, { transition: o }) {
      o && n && o.enter(t)
    },
    updated(t, { value: n, oldValue: o }, { transition: s }) {
      !n != !o &&
        (s
          ? n
            ? (s.beforeEnter(t), setDisplay(t, !0), s.enter(t))
            : s.leave(t, () => {
                setDisplay(t, !1)
              })
          : setDisplay(t, n))
    },
    beforeUnmount(t, { value: n }) {
      setDisplay(t, n)
    },
  }
function setDisplay(t, n) {
  ;(t.style.display = n ? t[vShowOriginalDisplay] : 'none'), (t[vShowHidden] = !n)
}
function initVShowForSSR() {
  vShow.getSSRProps = ({ value: t }) => {
    if (!t) return { style: { display: 'none' } }
  }
}
const CSS_VAR_TEXT = Symbol('')
function useCssVars(t) {
  const n = getCurrentInstance()
  if (!n) return
  const o = (n.ut = (r = t(n.proxy)) => {
      Array.from(document.querySelectorAll(`[data-v-owner="${n.uid}"]`)).forEach((i) =>
        setVarsOnNode(i, r),
      )
    }),
    s = () => {
      const r = t(n.proxy)
      n.ce ? setVarsOnNode(n.ce, r) : setVarsOnVNode(n.subTree, r), o(r)
    }
  onBeforeUpdate(() => {
    queuePostFlushCb(s)
  }),
    onMounted(() => {
      watch(s, NOOP, { flush: 'post' })
      const r = new MutationObserver(s)
      r.observe(n.subTree.el.parentNode, { childList: !0 }), onUnmounted(() => r.disconnect())
    })
}
function setVarsOnVNode(t, n) {
  if (t.shapeFlag & 128) {
    const o = t.suspense
    ;(t = o.activeBranch),
      o.pendingBranch &&
        !o.isHydrating &&
        o.effects.push(() => {
          setVarsOnVNode(o.activeBranch, n)
        })
  }
  for (; t.component; ) t = t.component.subTree
  if (t.shapeFlag & 1 && t.el) setVarsOnNode(t.el, n)
  else if (t.type === Fragment) t.children.forEach((o) => setVarsOnVNode(o, n))
  else if (t.type === Static) {
    let { el: o, anchor: s } = t
    for (; o && (setVarsOnNode(o, n), o !== s); ) o = o.nextSibling
  }
}
function setVarsOnNode(t, n) {
  if (t.nodeType === 1) {
    const o = t.style
    let s = ''
    for (const r in n) o.setProperty(`--${r}`, n[r]), (s += `--${r}: ${n[r]};`)
    o[CSS_VAR_TEXT] = s
  }
}
const displayRE = /(^|;)\s*display\s*:/
function patchStyle(t, n, o) {
  const s = t.style,
    r = isString(o)
  let i = !1
  if (o && !r) {
    if (n)
      if (isString(n))
        for (const a of n.split(';')) {
          const c = a.slice(0, a.indexOf(':')).trim()
          o[c] == null && setStyle(s, c, '')
        }
      else for (const a in n) o[a] == null && setStyle(s, a, '')
    for (const a in o) a === 'display' && (i = !0), setStyle(s, a, o[a])
  } else if (r) {
    if (n !== o) {
      const a = s[CSS_VAR_TEXT]
      a && (o += ';' + a), (s.cssText = o), (i = displayRE.test(o))
    }
  } else n && t.removeAttribute('style')
  vShowOriginalDisplay in t &&
    ((t[vShowOriginalDisplay] = i ? s.display : ''), t[vShowHidden] && (s.display = 'none'))
}
const importantRE = /\s*!important$/
function setStyle(t, n, o) {
  if (isArray$1(o)) o.forEach((s) => setStyle(t, n, s))
  else if ((o == null && (o = ''), n.startsWith('--'))) t.setProperty(n, o)
  else {
    const s = autoPrefix(t, n)
    importantRE.test(o)
      ? t.setProperty(hyphenate(s), o.replace(importantRE, ''), 'important')
      : (t[s] = o)
  }
}
const prefixes = ['Webkit', 'Moz', 'ms'],
  prefixCache = {}
function autoPrefix(t, n) {
  const o = prefixCache[n]
  if (o) return o
  let s = camelize(n)
  if (s !== 'filter' && s in t) return (prefixCache[n] = s)
  s = capitalize(s)
  for (let r = 0; r < prefixes.length; r++) {
    const i = prefixes[r] + s
    if (i in t) return (prefixCache[n] = i)
  }
  return n
}
const xlinkNS = 'http://www.w3.org/1999/xlink'
function patchAttr(t, n, o, s, r, i = isSpecialBooleanAttr(n)) {
  s && n.startsWith('xlink:')
    ? o == null
      ? t.removeAttributeNS(xlinkNS, n.slice(6, n.length))
      : t.setAttributeNS(xlinkNS, n, o)
    : o == null || (i && !includeBooleanAttr(o))
      ? t.removeAttribute(n)
      : t.setAttribute(n, i ? '' : isSymbol(o) ? String(o) : o)
}
function patchDOMProp(t, n, o, s, r) {
  if (n === 'innerHTML' || n === 'textContent') {
    o != null && (t[n] = n === 'innerHTML' ? unsafeToTrustedHTML(o) : o)
    return
  }
  const i = t.tagName
  if (n === 'value' && i !== 'PROGRESS' && !i.includes('-')) {
    const c = i === 'OPTION' ? t.getAttribute('value') || '' : t.value,
      u = o == null ? (t.type === 'checkbox' ? 'on' : '') : String(o)
    ;(c !== u || !('_value' in t)) && (t.value = u),
      o == null && t.removeAttribute(n),
      (t._value = o)
    return
  }
  let a = !1
  if (o === '' || o == null) {
    const c = typeof t[n]
    c === 'boolean'
      ? (o = includeBooleanAttr(o))
      : o == null && c === 'string'
        ? ((o = ''), (a = !0))
        : c === 'number' && ((o = 0), (a = !0))
  }
  try {
    t[n] = o
  } catch {}
  a && t.removeAttribute(r || n)
}
function addEventListener(t, n, o, s) {
  t.addEventListener(n, o, s)
}
function removeEventListener(t, n, o, s) {
  t.removeEventListener(n, o, s)
}
const veiKey = Symbol('_vei')
function patchEvent(t, n, o, s, r = null) {
  const i = t[veiKey] || (t[veiKey] = {}),
    a = i[n]
  if (s && a) a.value = s
  else {
    const [c, u] = parseName(n)
    if (s) {
      const g = (i[n] = createInvoker(s, r))
      addEventListener(t, c, g, u)
    } else a && (removeEventListener(t, c, a, u), (i[n] = void 0))
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/
function parseName(t) {
  let n
  if (optionsModifierRE.test(t)) {
    n = {}
    let s
    for (; (s = t.match(optionsModifierRE)); )
      (t = t.slice(0, t.length - s[0].length)), (n[s[0].toLowerCase()] = !0)
  }
  return [t[2] === ':' ? t.slice(3) : hyphenate(t.slice(2)), n]
}
let cachedNow = 0
const p = Promise.resolve(),
  getNow = () => cachedNow || (p.then(() => (cachedNow = 0)), (cachedNow = Date.now()))
function createInvoker(t, n) {
  const o = (s) => {
    if (!s._vts) s._vts = Date.now()
    else if (s._vts <= o.attached) return
    callWithAsyncErrorHandling(patchStopImmediatePropagation(s, o.value), n, 5, [s])
  }
  return (o.value = t), (o.attached = getNow()), o
}
function patchStopImmediatePropagation(t, n) {
  if (isArray$1(n)) {
    const o = t.stopImmediatePropagation
    return (
      (t.stopImmediatePropagation = () => {
        o.call(t), (t._stopped = !0)
      }),
      n.map((s) => (r) => !r._stopped && s && s(r))
    )
  } else return n
}
const isNativeOn = (t) =>
    t.charCodeAt(0) === 111 &&
    t.charCodeAt(1) === 110 &&
    t.charCodeAt(2) > 96 &&
    t.charCodeAt(2) < 123,
  patchProp = (t, n, o, s, r, i) => {
    const a = r === 'svg'
    n === 'class'
      ? patchClass(t, s, a)
      : n === 'style'
        ? patchStyle(t, o, s)
        : isOn(n)
          ? isModelListener(n) || patchEvent(t, n, o, s, i)
          : (
                n[0] === '.'
                  ? ((n = n.slice(1)), !0)
                  : n[0] === '^'
                    ? ((n = n.slice(1)), !1)
                    : shouldSetAsProp(t, n, s, a)
              )
            ? (patchDOMProp(t, n, s),
              !t.tagName.includes('-') &&
                (n === 'value' || n === 'checked' || n === 'selected') &&
                patchAttr(t, n, s, a, i, n !== 'value'))
            : t._isVueCE && (/[A-Z]/.test(n) || !isString(s))
              ? patchDOMProp(t, camelize(n), s, i, n)
              : (n === 'true-value'
                  ? (t._trueValue = s)
                  : n === 'false-value' && (t._falseValue = s),
                patchAttr(t, n, s, a))
  }
function shouldSetAsProp(t, n, o, s) {
  if (s)
    return !!(
      n === 'innerHTML' ||
      n === 'textContent' ||
      (n in t && isNativeOn(n) && isFunction(o))
    )
  if (
    n === 'spellcheck' ||
    n === 'draggable' ||
    n === 'translate' ||
    n === 'autocorrect' ||
    n === 'form' ||
    (n === 'list' && t.tagName === 'INPUT') ||
    (n === 'type' && t.tagName === 'TEXTAREA')
  )
    return !1
  if (n === 'width' || n === 'height') {
    const r = t.tagName
    if (r === 'IMG' || r === 'VIDEO' || r === 'CANVAS' || r === 'SOURCE') return !1
  }
  return isNativeOn(n) && isString(o) ? !1 : n in t
}
const REMOVAL = {}
/*! #__NO_SIDE_EFFECTS__ */ function defineCustomElement(t, n, o) {
  const s = defineComponent(t, n)
  isPlainObject$1(s) && extend(s, n)
  class r extends VueElement {
    constructor(a) {
      super(s, a, o)
    }
  }
  return (r.def = s), r
}
/*! #__NO_SIDE_EFFECTS__ */ const defineSSRCustomElement = (t, n) =>
    defineCustomElement(t, n, createSSRApp),
  BaseClass = typeof HTMLElement < 'u' ? HTMLElement : class {}
class VueElement extends BaseClass {
  constructor(n, o = {}, s = createApp$1) {
    super(),
      (this._def = n),
      (this._props = o),
      (this._createApp = s),
      (this._isVueCE = !0),
      (this._instance = null),
      (this._app = null),
      (this._nonce = this._def.nonce),
      (this._connected = !1),
      (this._resolved = !1),
      (this._numberProps = null),
      (this._styleChildren = new WeakSet()),
      (this._ob = null),
      this.shadowRoot && s !== createApp$1
        ? (this._root = this.shadowRoot)
        : n.shadowRoot !== !1
          ? (this.attachShadow({ mode: 'open' }), (this._root = this.shadowRoot))
          : (this._root = this)
  }
  connectedCallback() {
    if (!this.isConnected) return
    !this.shadowRoot && !this._resolved && this._parseSlots(), (this._connected = !0)
    let n = this
    for (; (n = n && (n.parentNode || n.host)); )
      if (n instanceof VueElement) {
        this._parent = n
        break
      }
    this._instance ||
      (this._resolved
        ? this._mount(this._def)
        : n && n._pendingResolve
          ? (this._pendingResolve = n._pendingResolve.then(() => {
              ;(this._pendingResolve = void 0), this._resolveDef()
            }))
          : this._resolveDef())
  }
  _setParent(n = this._parent) {
    n && ((this._instance.parent = n._instance), this._inheritParentContext(n))
  }
  _inheritParentContext(n = this._parent) {
    n && this._app && Object.setPrototypeOf(this._app._context.provides, n._instance.provides)
  }
  disconnectedCallback() {
    ;(this._connected = !1),
      nextTick(() => {
        this._connected ||
          (this._ob && (this._ob.disconnect(), (this._ob = null)),
          this._app && this._app.unmount(),
          this._instance && (this._instance.ce = void 0),
          (this._app = this._instance = null))
      })
  }
  _resolveDef() {
    if (this._pendingResolve) return
    for (let s = 0; s < this.attributes.length; s++) this._setAttr(this.attributes[s].name)
    ;(this._ob = new MutationObserver((s) => {
      for (const r of s) this._setAttr(r.attributeName)
    })),
      this._ob.observe(this, { attributes: !0 })
    const n = (s, r = !1) => {
        ;(this._resolved = !0), (this._pendingResolve = void 0)
        const { props: i, styles: a } = s
        let c
        if (i && !isArray$1(i))
          for (const u in i) {
            const g = i[u]
            ;(g === Number || (g && g.type === Number)) &&
              (u in this._props && (this._props[u] = toNumber(this._props[u])),
              ((c || (c = Object.create(null)))[camelize(u)] = !0))
          }
        ;(this._numberProps = c),
          this._resolveProps(s),
          this.shadowRoot && this._applyStyles(a),
          this._mount(s)
      },
      o = this._def.__asyncLoader
    o
      ? (this._pendingResolve = o().then((s) => {
          ;(s.configureApp = this._def.configureApp), n((this._def = s), !0)
        }))
      : n(this._def)
  }
  _mount(n) {
    ;(this._app = this._createApp(n)),
      this._inheritParentContext(),
      n.configureApp && n.configureApp(this._app),
      (this._app._ceVNode = this._createVNode()),
      this._app.mount(this._root)
    const o = this._instance && this._instance.exposed
    if (o)
      for (const s in o)
        hasOwn(this, s) || Object.defineProperty(this, s, { get: () => unref(o[s]) })
  }
  _resolveProps(n) {
    const { props: o } = n,
      s = isArray$1(o) ? o : Object.keys(o || {})
    for (const r of Object.keys(this)) r[0] !== '_' && s.includes(r) && this._setProp(r, this[r])
    for (const r of s.map(camelize))
      Object.defineProperty(this, r, {
        get() {
          return this._getProp(r)
        },
        set(i) {
          this._setProp(r, i, !0, !0)
        },
      })
  }
  _setAttr(n) {
    if (n.startsWith('data-v-')) return
    const o = this.hasAttribute(n)
    let s = o ? this.getAttribute(n) : REMOVAL
    const r = camelize(n)
    o && this._numberProps && this._numberProps[r] && (s = toNumber(s)), this._setProp(r, s, !1, !0)
  }
  _getProp(n) {
    return this._props[n]
  }
  _setProp(n, o, s = !0, r = !1) {
    if (
      o !== this._props[n] &&
      (o === REMOVAL
        ? delete this._props[n]
        : ((this._props[n] = o), n === 'key' && this._app && (this._app._ceVNode.key = o)),
      r && this._instance && this._update(),
      s)
    ) {
      const i = this._ob
      i && i.disconnect(),
        o === !0
          ? this.setAttribute(hyphenate(n), '')
          : typeof o == 'string' || typeof o == 'number'
            ? this.setAttribute(hyphenate(n), o + '')
            : o || this.removeAttribute(hyphenate(n)),
        i && i.observe(this, { attributes: !0 })
    }
  }
  _update() {
    const n = this._createVNode()
    this._app && (n.appContext = this._app._context), render(n, this._root)
  }
  _createVNode() {
    const n = {}
    this.shadowRoot || (n.onVnodeMounted = n.onVnodeUpdated = this._renderSlots.bind(this))
    const o = createVNode(this._def, extend(n, this._props))
    return (
      this._instance ||
        (o.ce = (s) => {
          ;(this._instance = s), (s.ce = this), (s.isCE = !0)
          const r = (i, a) => {
            this.dispatchEvent(
              new CustomEvent(
                i,
                isPlainObject$1(a[0]) ? extend({ detail: a }, a[0]) : { detail: a },
              ),
            )
          }
          ;(s.emit = (i, ...a) => {
            r(i, a), hyphenate(i) !== i && r(hyphenate(i), a)
          }),
            this._setParent()
        }),
      o
    )
  }
  _applyStyles(n, o) {
    if (!n) return
    if (o) {
      if (o === this._def || this._styleChildren.has(o)) return
      this._styleChildren.add(o)
    }
    const s = this._nonce
    for (let r = n.length - 1; r >= 0; r--) {
      const i = document.createElement('style')
      s && i.setAttribute('nonce', s), (i.textContent = n[r]), this.shadowRoot.prepend(i)
    }
  }
  _parseSlots() {
    const n = (this._slots = {})
    let o
    for (; (o = this.firstChild); ) {
      const s = (o.nodeType === 1 && o.getAttribute('slot')) || 'default'
      ;(n[s] || (n[s] = [])).push(o), this.removeChild(o)
    }
  }
  _renderSlots() {
    const n = (this._teleportTarget || this).querySelectorAll('slot'),
      o = this._instance.type.__scopeId
    for (let s = 0; s < n.length; s++) {
      const r = n[s],
        i = r.getAttribute('name') || 'default',
        a = this._slots[i],
        c = r.parentNode
      if (a)
        for (const u of a) {
          if (o && u.nodeType === 1) {
            const g = o + '-s',
              d = document.createTreeWalker(u, 1)
            u.setAttribute(g, '')
            let v
            for (; (v = d.nextNode()); ) v.setAttribute(g, '')
          }
          c.insertBefore(u, r)
        }
      else for (; r.firstChild; ) c.insertBefore(r.firstChild, r)
      c.removeChild(r)
    }
  }
  _injectChildStyle(n) {
    this._applyStyles(n.styles, n)
  }
  _removeChildStyle(n) {}
}
function useHost(t) {
  const n = getCurrentInstance(),
    o = n && n.ce
  return o || null
}
function useShadowRoot() {
  const t = useHost()
  return t && t.shadowRoot
}
function useCssModule(t = '$style') {
  {
    const n = getCurrentInstance()
    if (!n) return EMPTY_OBJ
    const o = n.type.__cssModules
    if (!o) return EMPTY_OBJ
    const s = o[t]
    return s || EMPTY_OBJ
  }
}
const positionMap = new WeakMap(),
  newPositionMap = new WeakMap(),
  moveCbKey = Symbol('_moveCb'),
  enterCbKey = Symbol('_enterCb'),
  decorate = (t) => (delete t.props.mode, t),
  TransitionGroupImpl = decorate({
    name: 'TransitionGroup',
    props: extend({}, TransitionPropsValidators, { tag: String, moveClass: String }),
    setup(t, { slots: n }) {
      const o = getCurrentInstance(),
        s = useTransitionState()
      let r, i
      return (
        onUpdated(() => {
          if (!r.length) return
          const a = t.moveClass || `${t.name || 'v'}-move`
          if (!hasCSSTransform(r[0].el, o.vnode.el, a)) {
            r = []
            return
          }
          r.forEach(callPendingCbs), r.forEach(recordPosition)
          const c = r.filter(applyTranslation)
          forceReflow(),
            c.forEach((u) => {
              const g = u.el,
                d = g.style
              addTransitionClass(g, a),
                (d.transform = d.webkitTransform = d.transitionDuration = '')
              const v = (g[moveCbKey] = (y) => {
                ;(y && y.target !== g) ||
                  ((!y || /transform$/.test(y.propertyName)) &&
                    (g.removeEventListener('transitionend', v),
                    (g[moveCbKey] = null),
                    removeTransitionClass(g, a)))
              })
              g.addEventListener('transitionend', v)
            }),
            (r = [])
        }),
        () => {
          const a = toRaw(t),
            c = resolveTransitionProps(a)
          let u = a.tag || Fragment
          if (((r = []), i))
            for (let g = 0; g < i.length; g++) {
              const d = i[g]
              d.el &&
                d.el instanceof Element &&
                (r.push(d),
                setTransitionHooks(d, resolveTransitionHooks(d, c, s, o)),
                positionMap.set(d, d.el.getBoundingClientRect()))
            }
          i = n.default ? getTransitionRawChildren(n.default()) : []
          for (let g = 0; g < i.length; g++) {
            const d = i[g]
            d.key != null && setTransitionHooks(d, resolveTransitionHooks(d, c, s, o))
          }
          return createVNode(u, null, i)
        }
      )
    },
  }),
  TransitionGroup = TransitionGroupImpl
function callPendingCbs(t) {
  const n = t.el
  n[moveCbKey] && n[moveCbKey](), n[enterCbKey] && n[enterCbKey]()
}
function recordPosition(t) {
  newPositionMap.set(t, t.el.getBoundingClientRect())
}
function applyTranslation(t) {
  const n = positionMap.get(t),
    o = newPositionMap.get(t),
    s = n.left - o.left,
    r = n.top - o.top
  if (s || r) {
    const i = t.el.style
    return (
      (i.transform = i.webkitTransform = `translate(${s}px,${r}px)`),
      (i.transitionDuration = '0s'),
      t
    )
  }
}
function hasCSSTransform(t, n, o) {
  const s = t.cloneNode(),
    r = t[vtcKey]
  r &&
    r.forEach((c) => {
      c.split(/\s+/).forEach((u) => u && s.classList.remove(u))
    }),
    o.split(/\s+/).forEach((c) => c && s.classList.add(c)),
    (s.style.display = 'none')
  const i = n.nodeType === 1 ? n : n.parentNode
  i.appendChild(s)
  const { hasTransform: a } = getTransitionInfo(s)
  return i.removeChild(s), a
}
const getModelAssigner = (t) => {
  const n = t.props['onUpdate:modelValue'] || !1
  return isArray$1(n) ? (o) => invokeArrayFns(n, o) : n
}
function onCompositionStart(t) {
  t.target.composing = !0
}
function onCompositionEnd(t) {
  const n = t.target
  n.composing && ((n.composing = !1), n.dispatchEvent(new Event('input')))
}
const assignKey = Symbol('_assign'),
  vModelText = {
    created(t, { modifiers: { lazy: n, trim: o, number: s } }, r) {
      t[assignKey] = getModelAssigner(r)
      const i = s || (r.props && r.props.type === 'number')
      addEventListener(t, n ? 'change' : 'input', (a) => {
        if (a.target.composing) return
        let c = t.value
        o && (c = c.trim()), i && (c = looseToNumber(c)), t[assignKey](c)
      }),
        o &&
          addEventListener(t, 'change', () => {
            t.value = t.value.trim()
          }),
        n ||
          (addEventListener(t, 'compositionstart', onCompositionStart),
          addEventListener(t, 'compositionend', onCompositionEnd),
          addEventListener(t, 'change', onCompositionEnd))
    },
    mounted(t, { value: n }) {
      t.value = n ?? ''
    },
    beforeUpdate(t, { value: n, oldValue: o, modifiers: { lazy: s, trim: r, number: i } }, a) {
      if (((t[assignKey] = getModelAssigner(a)), t.composing)) return
      const c =
          (i || t.type === 'number') && !/^0\d/.test(t.value) ? looseToNumber(t.value) : t.value,
        u = n ?? ''
      c !== u &&
        ((document.activeElement === t &&
          t.type !== 'range' &&
          ((s && n === o) || (r && t.value.trim() === u))) ||
          (t.value = u))
    },
  },
  vModelCheckbox = {
    deep: !0,
    created(t, n, o) {
      ;(t[assignKey] = getModelAssigner(o)),
        addEventListener(t, 'change', () => {
          const s = t._modelValue,
            r = getValue(t),
            i = t.checked,
            a = t[assignKey]
          if (isArray$1(s)) {
            const c = looseIndexOf(s, r),
              u = c !== -1
            if (i && !u) a(s.concat(r))
            else if (!i && u) {
              const g = [...s]
              g.splice(c, 1), a(g)
            }
          } else if (isSet(s)) {
            const c = new Set(s)
            i ? c.add(r) : c.delete(r), a(c)
          } else a(getCheckboxValue(t, i))
        })
    },
    mounted: setChecked,
    beforeUpdate(t, n, o) {
      ;(t[assignKey] = getModelAssigner(o)), setChecked(t, n, o)
    },
  }
function setChecked(t, { value: n, oldValue: o }, s) {
  t._modelValue = n
  let r
  if (isArray$1(n)) r = looseIndexOf(n, s.props.value) > -1
  else if (isSet(n)) r = n.has(s.props.value)
  else {
    if (n === o) return
    r = looseEqual(n, getCheckboxValue(t, !0))
  }
  t.checked !== r && (t.checked = r)
}
const vModelRadio = {
    created(t, { value: n }, o) {
      ;(t.checked = looseEqual(n, o.props.value)),
        (t[assignKey] = getModelAssigner(o)),
        addEventListener(t, 'change', () => {
          t[assignKey](getValue(t))
        })
    },
    beforeUpdate(t, { value: n, oldValue: o }, s) {
      ;(t[assignKey] = getModelAssigner(s)), n !== o && (t.checked = looseEqual(n, s.props.value))
    },
  },
  vModelSelect = {
    deep: !0,
    created(t, { value: n, modifiers: { number: o } }, s) {
      const r = isSet(n)
      addEventListener(t, 'change', () => {
        const i = Array.prototype.filter
          .call(t.options, (a) => a.selected)
          .map((a) => (o ? looseToNumber(getValue(a)) : getValue(a)))
        t[assignKey](t.multiple ? (r ? new Set(i) : i) : i[0]),
          (t._assigning = !0),
          nextTick(() => {
            t._assigning = !1
          })
      }),
        (t[assignKey] = getModelAssigner(s))
    },
    mounted(t, { value: n }) {
      setSelected(t, n)
    },
    beforeUpdate(t, n, o) {
      t[assignKey] = getModelAssigner(o)
    },
    updated(t, { value: n }) {
      t._assigning || setSelected(t, n)
    },
  }
function setSelected(t, n) {
  const o = t.multiple,
    s = isArray$1(n)
  if (!(o && !s && !isSet(n))) {
    for (let r = 0, i = t.options.length; r < i; r++) {
      const a = t.options[r],
        c = getValue(a)
      if (o)
        if (s) {
          const u = typeof c
          u === 'string' || u === 'number'
            ? (a.selected = n.some((g) => String(g) === String(c)))
            : (a.selected = looseIndexOf(n, c) > -1)
        } else a.selected = n.has(c)
      else if (looseEqual(getValue(a), n)) {
        t.selectedIndex !== r && (t.selectedIndex = r)
        return
      }
    }
    !o && t.selectedIndex !== -1 && (t.selectedIndex = -1)
  }
}
function getValue(t) {
  return '_value' in t ? t._value : t.value
}
function getCheckboxValue(t, n) {
  const o = n ? '_trueValue' : '_falseValue'
  return o in t ? t[o] : n
}
const vModelDynamic = {
  created(t, n, o) {
    callModelHook(t, n, o, null, 'created')
  },
  mounted(t, n, o) {
    callModelHook(t, n, o, null, 'mounted')
  },
  beforeUpdate(t, n, o, s) {
    callModelHook(t, n, o, s, 'beforeUpdate')
  },
  updated(t, n, o, s) {
    callModelHook(t, n, o, s, 'updated')
  },
}
function resolveDynamicModel(t, n) {
  switch (t) {
    case 'SELECT':
      return vModelSelect
    case 'TEXTAREA':
      return vModelText
    default:
      switch (n) {
        case 'checkbox':
          return vModelCheckbox
        case 'radio':
          return vModelRadio
        default:
          return vModelText
      }
  }
}
function callModelHook(t, n, o, s, r) {
  const a = resolveDynamicModel(t.tagName, o.props && o.props.type)[r]
  a && a(t, n, o, s)
}
function initVModelForSSR() {
  ;(vModelText.getSSRProps = ({ value: t }) => ({ value: t })),
    (vModelRadio.getSSRProps = ({ value: t }, n) => {
      if (n.props && looseEqual(n.props.value, t)) return { checked: !0 }
    }),
    (vModelCheckbox.getSSRProps = ({ value: t }, n) => {
      if (isArray$1(t)) {
        if (n.props && looseIndexOf(t, n.props.value) > -1) return { checked: !0 }
      } else if (isSet(t)) {
        if (n.props && t.has(n.props.value)) return { checked: !0 }
      } else if (t) return { checked: !0 }
    }),
    (vModelDynamic.getSSRProps = (t, n) => {
      if (typeof n.type != 'string') return
      const o = resolveDynamicModel(n.type.toUpperCase(), n.props && n.props.type)
      if (o.getSSRProps) return o.getSSRProps(t, n)
    })
}
const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'],
  modifierGuards = {
    stop: (t) => t.stopPropagation(),
    prevent: (t) => t.preventDefault(),
    self: (t) => t.target !== t.currentTarget,
    ctrl: (t) => !t.ctrlKey,
    shift: (t) => !t.shiftKey,
    alt: (t) => !t.altKey,
    meta: (t) => !t.metaKey,
    left: (t) => 'button' in t && t.button !== 0,
    middle: (t) => 'button' in t && t.button !== 1,
    right: (t) => 'button' in t && t.button !== 2,
    exact: (t, n) => systemModifiers.some((o) => t[`${o}Key`] && !n.includes(o)),
  },
  withModifiers = (t, n) => {
    const o = t._withMods || (t._withMods = {}),
      s = n.join('.')
    return (
      o[s] ||
      (o[s] = (r, ...i) => {
        for (let a = 0; a < n.length; a++) {
          const c = modifierGuards[n[a]]
          if (c && c(r, n)) return
        }
        return t(r, ...i)
      })
    )
  },
  keyNames = {
    esc: 'escape',
    space: ' ',
    up: 'arrow-up',
    left: 'arrow-left',
    right: 'arrow-right',
    down: 'arrow-down',
    delete: 'backspace',
  },
  withKeys = (t, n) => {
    const o = t._withKeys || (t._withKeys = {}),
      s = n.join('.')
    return (
      o[s] ||
      (o[s] = (r) => {
        if (!('key' in r)) return
        const i = hyphenate(r.key)
        if (n.some((a) => a === i || keyNames[a] === i)) return t(r)
      })
    )
  },
  rendererOptions = extend({ patchProp }, nodeOps)
let renderer,
  enabledHydration = !1
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions))
}
function ensureHydrationRenderer() {
  return (
    (renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions)),
    (enabledHydration = !0),
    renderer
  )
}
const render = (...t) => {
    ensureRenderer().render(...t)
  },
  hydrate = (...t) => {
    ensureHydrationRenderer().hydrate(...t)
  },
  createApp$1 = (...t) => {
    const n = ensureRenderer().createApp(...t),
      { mount: o } = n
    return (
      (n.mount = (s) => {
        const r = normalizeContainer(s)
        if (!r) return
        const i = n._component
        !isFunction(i) && !i.render && !i.template && (i.template = r.innerHTML),
          r.nodeType === 1 && (r.textContent = '')
        const a = o(r, !1, resolveRootNamespace(r))
        return (
          r instanceof Element && (r.removeAttribute('v-cloak'), r.setAttribute('data-v-app', '')),
          a
        )
      }),
      n
    )
  },
  createSSRApp = (...t) => {
    const n = ensureHydrationRenderer().createApp(...t),
      { mount: o } = n
    return (
      (n.mount = (s) => {
        const r = normalizeContainer(s)
        if (r) return o(r, !0, resolveRootNamespace(r))
      }),
      n
    )
  }
function resolveRootNamespace(t) {
  if (t instanceof SVGElement) return 'svg'
  if (typeof MathMLElement == 'function' && t instanceof MathMLElement) return 'mathml'
}
function normalizeContainer(t) {
  return isString(t) ? document.querySelector(t) : t
}
let ssrDirectiveInitialized = !1
const initDirectivesForSSR = () => {
  ssrDirectiveInitialized || ((ssrDirectiveInitialized = !0), initVModelForSSR(), initVShowForSSR())
}
/**
 * vue v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ const compile = () => {},
  Vue = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        BaseTransition,
        BaseTransitionPropsValidators,
        Comment,
        DeprecationTypes,
        EffectScope,
        ErrorCodes,
        ErrorTypeStrings,
        Fragment,
        KeepAlive,
        ReactiveEffect,
        Static,
        Suspense,
        Teleport,
        Text,
        TrackOpTypes,
        Transition,
        TransitionGroup,
        TriggerOpTypes,
        VueElement,
        assertNumber,
        callWithAsyncErrorHandling,
        callWithErrorHandling,
        camelize,
        capitalize,
        cloneVNode,
        compatUtils,
        compile,
        computed,
        createApp: createApp$1,
        createBlock,
        createCommentVNode,
        createElementBlock,
        createElementVNode: createBaseVNode,
        createHydrationRenderer,
        createPropsRestProxy,
        createRenderer,
        createSSRApp,
        createSlots,
        createStaticVNode,
        createTextVNode,
        createVNode,
        customRef,
        defineAsyncComponent,
        defineComponent,
        defineCustomElement,
        defineEmits,
        defineExpose,
        defineModel,
        defineOptions,
        defineProps,
        defineSSRCustomElement,
        defineSlots,
        devtools,
        effect,
        effectScope,
        getCurrentInstance,
        getCurrentScope,
        getCurrentWatcher,
        getTransitionRawChildren,
        guardReactiveProps,
        h: h$1,
        handleError,
        hasInjectionContext,
        hydrate,
        hydrateOnIdle,
        hydrateOnInteraction,
        hydrateOnMediaQuery,
        hydrateOnVisible,
        initCustomFormatter,
        initDirectivesForSSR,
        inject,
        isMemoSame,
        isProxy,
        isReactive,
        isReadonly,
        isRef,
        isRuntimeOnly,
        isShallow,
        isVNode,
        markRaw,
        mergeDefaults,
        mergeModels,
        mergeProps,
        nextTick,
        normalizeClass,
        normalizeProps,
        normalizeStyle,
        onActivated,
        onBeforeMount,
        onBeforeUnmount,
        onBeforeUpdate,
        onDeactivated,
        onErrorCaptured,
        onMounted,
        onRenderTracked,
        onRenderTriggered,
        onScopeDispose,
        onServerPrefetch,
        onUnmounted,
        onUpdated,
        onWatcherCleanup,
        openBlock,
        popScopeId,
        provide,
        proxyRefs,
        pushScopeId,
        queuePostFlushCb,
        reactive,
        readonly,
        ref,
        registerRuntimeCompiler,
        render,
        renderList,
        renderSlot,
        resolveComponent,
        resolveDirective,
        resolveDynamicComponent,
        resolveFilter,
        resolveTransitionHooks,
        setBlockTracking,
        setDevtoolsHook,
        setTransitionHooks,
        shallowReactive,
        shallowReadonly,
        shallowRef,
        ssrContextKey,
        ssrUtils,
        stop,
        toDisplayString,
        toHandlerKey,
        toHandlers,
        toRaw,
        toRef,
        toRefs,
        toValue,
        transformVNodeArgs,
        triggerRef,
        unref,
        useAttrs,
        useCssModule,
        useCssVars,
        useHost,
        useId,
        useModel,
        useSSRContext,
        useShadowRoot,
        useSlots,
        useTemplateRef,
        useTransitionState,
        vModelCheckbox,
        vModelDynamic,
        vModelRadio,
        vModelSelect,
        vModelText,
        vShow,
        version,
        warn,
        watch,
        watchEffect,
        watchPostEffect,
        watchSyncEffect,
        withAsyncContext,
        withCtx,
        withDefaults,
        withDirectives,
        withKeys,
        withMemo,
        withModifiers,
        withScopeId,
      },
      Symbol.toStringTag,
      { value: 'Module' },
    ),
  )
function getVueExport(t) {
  return Vue[t]
}
const h = getVueExport('h'),
  createApp = getVueExport('createApp'),
  getSvgAttrs = (t, n, o) =>
    getAttributes({
      ...n,
      preserveAspectRatio: 'xMidYMid meet',
      xmlns: 'http://www.w3.org/2000/svg',
      title: t,
      ...o,
    }),
  getVue2SvgAttrs = (t, n, o, s) => {
    const r = { attrs: getSvgAttrs(t, n, o.attrs), on: s, style: { ...o.staticStyle, ...o.style } }
    return (
      delete r.attrs.style,
      (o.staticClass || o.class) &&
        ((r.class = {}),
        o.staticClass && (r.class[o.staticClass] = !0),
        o.class && (r.class[o.class] = !0)),
      r
    )
  },
  createSVGComponent = (t, n, o) => ({
    props: { title: String },
    name: t,
    ...(createApp
      ? {
          setup(s, r) {
            let { title: i } = s,
              { attrs: a, slots: c } = r
            return () =>
              h('svg', getSvgAttrs(i, n, a), [
                ...(i ? [h('title', i)] : []),
                ...o.map((u) => {
                  let { elem: g, attrs: d } = u
                  return h(g, d)
                }),
                ...(c.default ? c.default() : []),
              ])
          },
        }
      : {
          functional: !0,
          render(s, r) {
            let {
              props: { title: i },
              children: a,
              data: c,
              listeners: u,
            } = r
            return s('svg', getVue2SvgAttrs(i, n, c, u), [
              ...(i ? [s('title', null, i)] : []),
              ...o.map((g) => {
                let { elem: d, attrs: v } = g
                return s(d, { attrs: v })
              }),
              ...(a || []),
            ])
          },
        }),
  }),
  Add20 = createSVGComponent(
    'Add20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: { d: 'M17 15L17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z' },
      },
    ],
  ),
  ArrowRight20 = createSVGComponent(
    'ArrowRight20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 20 20',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M11.8 2.8L10.8 3.8 16.2 9.3 1 9.3 1 10.7 16.2 10.7 10.8 16.2 11.8 17.2 19 10z',
        },
      },
    ],
  ),
  Bee32 = createSVGComponent(
    'Bee32',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      fill: 'currentColor',
      width: 32,
      height: 32,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M16 10a6 6 0 00-6 6v8a6 6 0 0012 0V16A6 6 0 0016 10zm-4.25 7.87h8.5v4.25h-8.5zM16 28.25A4.27 4.27 0 0111.75 24v-.13h8.5V24A4.27 4.27 0 0116 28.25zm4.25-12.13h-8.5V16a4.25 4.25 0 018.5 0zM30.66 19.21L24 13v9.1a4 4 0 008 0A3.83 3.83 0 0030.66 19.21zM28 24.35a2.25 2.25 0 01-2.25-2.25V17l3.72 3.47h0A2.05 2.05 0 0130.2 22 2.25 2.25 0 0128 24.35zM0 22.1a4 4 0 008 0V13L1.34 19.21A3.88 3.88 0 000 22.1zm2.48-1.56h0L6.25 17v5.1a2.25 2.25 0 01-4.5 0A2.05 2.05 0 012.48 20.54zM15 5.5A3.5 3.5 0 1011.5 9 3.5 3.5 0 0015 5.5zm-5.25 0A1.75 1.75 0 1111.5 7.25 1.77 1.77 0 019.75 5.5zM20.5 2A3.5 3.5 0 1024 5.5 3.5 3.5 0 0020.5 2zm0 5.25A1.75 1.75 0 1122.25 5.5 1.77 1.77 0 0120.5 7.25z',
        },
      },
    ],
  ),
  CheckmarkFilled20 = createSVGComponent(
    'CheckmarkFilled20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 20 20',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z',
        },
      },
      {
        elem: 'path',
        attrs: {
          fill: 'none',
          d: 'M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z',
          'data-icon-path': 'inner-path',
          opacity: '0',
        },
      },
    ],
  ),
  Document20 = createSVGComponent(
    'Document20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M25.7,9.3l-7-7C18.5,2.1,18.3,2,18,2H8C6.9,2,6,2.9,6,4v24c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V10C26,9.7,25.9,9.5,25.7,9.3	z M18,4.4l5.6,5.6H18V4.4z M24,28H8V4h8v6c0,1.1,0.9,2,2,2h6V28z',
        },
      },
      { elem: 'path', attrs: { d: 'M10 22H22V24H10zM10 16H22V18H10z' } },
    ],
  ),
  ErrorFilled20 = createSVGComponent(
    'ErrorFilled20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 20 20',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z',
        },
      },
      {
        elem: 'path',
        attrs: {
          d: 'M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z',
          'data-icon-path': 'inner-path',
          opacity: '0',
        },
      },
    ],
  ),
  Home20 = createSVGComponent(
    'Home20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M16.6123,2.2138a1.01,1.01,0,0,0-1.2427,0L1,13.4194l1.2427,1.5717L4,13.6209V26a2.0041,2.0041,0,0,0,2,2H26a2.0037,2.0037,0,0,0,2-2V13.63L29.7573,15,31,13.4282ZM18,26H14V18h4Zm2,0V18a2.0023,2.0023,0,0,0-2-2H14a2.002,2.002,0,0,0-2,2v8H6V12.0615l10-7.79,10,7.8005V26Z',
        },
      },
    ],
  ),
  InformationFilled20 = createSVGComponent(
    'InformationFilled20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          fill: 'none',
          d: 'M16,8a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,13.875H17.125v-8H13v2.25h1.875v5.75H12v2.25h8Z',
          'data-icon-path': 'inner-path',
        },
      },
      {
        elem: 'path',
        attrs: {
          d: 'M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,6a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,16.125H12v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z',
        },
      },
    ],
  ),
  Logout20 = createSVGComponent(
    'Logout20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M6,30H18a2.0023,2.0023,0,0,0,2-2V25H18v3H6V4H18V7h2V4a2.0023,2.0023,0,0,0-2-2H6A2.0023,2.0023,0,0,0,4,4V28A2.0023,2.0023,0,0,0,6,30Z',
        },
      },
      {
        elem: 'path',
        attrs: {
          d: 'M20.586 20.586L24.172 17 10 17 10 15 24.172 15 20.586 11.414 22 10 28 16 22 22 20.586 20.586z',
        },
      },
    ],
  ),
  Settings20 = createSVGComponent(
    'Settings20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M27,16.76c0-.25,0-.5,0-.76s0-.51,0-.77l1.92-1.68A2,2,0,0,0,29.3,11L26.94,7a2,2,0,0,0-1.73-1,2,2,0,0,0-.64.1l-2.43.82a11.35,11.35,0,0,0-1.31-.75l-.51-2.52a2,2,0,0,0-2-1.61H13.64a2,2,0,0,0-2,1.61l-.51,2.52a11.48,11.48,0,0,0-1.32.75L7.43,6.06A2,2,0,0,0,6.79,6,2,2,0,0,0,5.06,7L2.7,11a2,2,0,0,0,.41,2.51L5,15.24c0,.25,0,.5,0,.76s0,.51,0,.77L3.11,18.45A2,2,0,0,0,2.7,21L5.06,25a2,2,0,0,0,1.73,1,2,2,0,0,0,.64-.1l2.43-.82a11.35,11.35,0,0,0,1.31.75l.51,2.52a2,2,0,0,0,2,1.61h4.72a2,2,0,0,0,2-1.61l.51-2.52a11.48,11.48,0,0,0,1.32-.75l2.42.82a2,2,0,0,0,.64.1,2,2,0,0,0,1.73-1L29.3,21a2,2,0,0,0-.41-2.51ZM25.21,24l-3.43-1.16a8.86,8.86,0,0,1-2.71,1.57L18.36,28H13.64l-.71-3.55a9.36,9.36,0,0,1-2.7-1.57L6.79,24,4.43,20l2.72-2.4a8.9,8.9,0,0,1,0-3.13L4.43,12,6.79,8l3.43,1.16a8.86,8.86,0,0,1,2.71-1.57L13.64,4h4.72l.71,3.55a9.36,9.36,0,0,1,2.7,1.57L25.21,8,27.57,12l-2.72,2.4a8.9,8.9,0,0,1,0,3.13L27.57,20Z',
        },
      },
      {
        elem: 'path',
        attrs: {
          d: 'M16,22a6,6,0,1,1,6-6A5.94,5.94,0,0,1,16,22Zm0-10a3.91,3.91,0,0,0-4,4,3.91,3.91,0,0,0,4,4,3.91,3.91,0,0,0,4-4A3.91,3.91,0,0,0,16,12Z',
        },
      },
    ],
  ),
  TrashCan20 = createSVGComponent(
    'TrashCan20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      { elem: 'path', attrs: { d: 'M12 12H14V24H12zM18 12H20V24H18z' } },
      {
        elem: 'path',
        attrs: { d: 'M4 6V8H6V28a2 2 0 002 2H24a2 2 0 002-2V8h2V6zM8 28V8H24V28zM12 2H20V4H12z' },
      },
    ],
  ),
  UserProfile20 = createSVGComponent(
    'UserProfile20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M12 4A5 5 0 117 9a5 5 0 015-5m0-2a7 7 0 107 7A7 7 0 0012 2zM22 30H20V25a5 5 0 00-5-5H9a5 5 0 00-5 5v5H2V25a7 7 0 017-7h6a7 7 0 017 7zM22 4H32V6H22zM22 9H32V11H22zM22 14H29V16H22z',
        },
      },
    ],
  ),
  View20 = createSVGComponent(
    'View20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M30.94,15.66A16.69,16.69,0,0,0,16,5,16.69,16.69,0,0,0,1.06,15.66a1,1,0,0,0,0,.68A16.69,16.69,0,0,0,16,27,16.69,16.69,0,0,0,30.94,16.34,1,1,0,0,0,30.94,15.66ZM16,25c-5.3,0-10.9-3.93-12.93-9C5.1,10.93,10.7,7,16,7s10.9,3.93,12.93,9C26.9,21.07,21.3,25,16,25Z',
        },
      },
      {
        elem: 'path',
        attrs: { d: 'M16,10a6,6,0,1,0,6,6A6,6,0,0,0,16,10Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,16,20Z' },
      },
    ],
  ),
  ViewOff20 = createSVGComponent(
    'ViewOff20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M5.24,22.51l1.43-1.42A14.06,14.06,0,0,1,3.07,16C5.1,10.93,10.7,7,16,7a12.38,12.38,0,0,1,4,.72l1.55-1.56A14.72,14.72,0,0,0,16,5,16.69,16.69,0,0,0,1.06,15.66a1,1,0,0,0,0,.68A16,16,0,0,0,5.24,22.51Z',
        },
      },
      {
        elem: 'path',
        attrs: {
          d: 'M12 15.73a4 4 0 013.7-3.7l1.81-1.82a6 6 0 00-7.33 7.33zM30.94 15.66A16.4 16.4 0 0025.2 8.22L30 3.41 28.59 2 2 28.59 3.41 30l5.1-5.1A15.29 15.29 0 0016 27 16.69 16.69 0 0030.94 16.34 1 1 0 0030.94 15.66zM20 16a4 4 0 01-6 3.44L19.44 14A4 4 0 0120 16zm-4 9a13.05 13.05 0 01-6-1.58l2.54-2.54a6 6 0 008.35-8.35l2.87-2.87A14.54 14.54 0 0128.93 16C26.9 21.07 21.3 25 16 25z',
        },
      },
    ],
  ),
  WarningFilled20 = createSVGComponent(
    'WarningFilled20',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 20 20',
      fill: 'currentColor',
      width: 20,
      height: 20,
    },
    [
      {
        elem: 'path',
        attrs: {
          d: 'M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1	s1,0.4,1,1S10.6,16,10,16z',
        },
      },
      {
        elem: 'path',
        attrs: {
          d: 'M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S10.6,16,10,16z',
          'data-icon-path': 'inner-path',
          opacity: '0',
        },
      },
    ],
  ),
  CarbonIconsVue = {
    install(t, n) {
      const { components: o } = n
      Object.keys(o).forEach((s) => {
        t.component(s, o[s])
      })
    },
  },
  _export_sfc = (t, n) => {
    const o = t.__vccOpts || t
    for (const [s, r] of n) o[s] = r
    return o
  },
  _sfc_main$s = {
    __name: 'DonutLoader',
    props: {
      size: { type: String, default: '2rem' },
      color: { type: String, default: '#979fd0' },
      multi: { type: Boolean, default: !1 },
    },
    setup(t) {
      const n = t,
        o = computed(() => {
          const r = parseFloat(n.size),
            i = n.size.replace(r, '')
          return `${(r / 6).toFixed(2)}${i}`
        }),
        s = computed(() => `${n.color}4D`)
      return (r, i) => (
        openBlock(),
        createElementBlock(
          'div',
          {
            class: normalizeClass(['donut', { multi: t.multi }]),
            style: normalizeStyle({
              width: t.size,
              height: t.size,
              borderWidth: o.value,
              borderColor: s.value,
              borderTopColor: t.color,
              ...(t.multi ? { borderBottomColor: t.color } : {}),
            }),
          },
          null,
          6,
        )
      )
    },
  },
  DonutLoader = _export_sfc(_sfc_main$s, [['__scopeId', 'data-v-28ec9db0']]),
  toasts = reactive([])
function showToast({ message: t, type: n = 'info', timeout: o = 4e3 }) {
  const s = { message: t, type: n }
  toasts.push(s), o > 0 && setTimeout(() => removeToast(s), o)
}
function removeToast(t) {
  const n = toasts.indexOf(t)
  n !== -1 && toasts.splice(n, 1)
}
const ToastPlugin = {
  install(t) {
    t.config.globalProperties.$toast = showToast
  },
  toasts,
  showToast,
  removeToast,
}
var E = Object.defineProperty,
  M = Object.defineProperties,
  x = Object.getOwnPropertyDescriptors,
  V = Object.getOwnPropertySymbols,
  I = Object.prototype.hasOwnProperty,
  N = Object.prototype.propertyIsEnumerable,
  C = (t, n, o) =>
    n in t ? E(t, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : (t[n] = o),
  f = (t, n) => {
    for (var o in n || (n = {})) I.call(n, o) && C(t, o, n[o])
    if (V) for (var o of V(n)) N.call(n, o) && C(t, o, n[o])
    return t
  },
  m = (t, n) => M(t, x(n))
const U = {
    props: { autoscroll: { type: Boolean, default: !0 } },
    watch: {
      typeAheadPointer() {
        this.autoscroll && this.maybeAdjustScroll()
      },
      open(t) {
        this.autoscroll && t && this.$nextTick(() => this.maybeAdjustScroll())
      },
    },
    methods: {
      maybeAdjustScroll() {
        var t
        const n =
          ((t = this.$refs.dropdownMenu) == null ? void 0 : t.children[this.typeAheadPointer]) || !1
        if (n) {
          const o = this.getDropdownViewport(),
            { top: s, bottom: r, height: i } = n.getBoundingClientRect()
          if (s < o.top) return (this.$refs.dropdownMenu.scrollTop = n.offsetTop)
          if (r > o.bottom)
            return (this.$refs.dropdownMenu.scrollTop = n.offsetTop - (o.height - i))
        }
      },
      getDropdownViewport() {
        return this.$refs.dropdownMenu
          ? this.$refs.dropdownMenu.getBoundingClientRect()
          : { height: 0, top: 0, bottom: 0 }
      },
    },
  },
  q = {
    data() {
      return { typeAheadPointer: -1 }
    },
    watch: {
      filteredOptions() {
        for (let t = 0; t < this.filteredOptions.length; t++)
          if (this.selectable(this.filteredOptions[t])) {
            this.typeAheadPointer = t
            break
          }
      },
      open(t) {
        t && this.typeAheadToLastSelected()
      },
      selectedValue() {
        this.open && this.typeAheadToLastSelected()
      },
    },
    methods: {
      typeAheadUp() {
        for (let t = this.typeAheadPointer - 1; t >= 0; t--)
          if (this.selectable(this.filteredOptions[t])) {
            this.typeAheadPointer = t
            break
          }
      },
      typeAheadDown() {
        for (let t = this.typeAheadPointer + 1; t < this.filteredOptions.length; t++)
          if (this.selectable(this.filteredOptions[t])) {
            this.typeAheadPointer = t
            break
          }
      },
      typeAheadSelect() {
        const t = this.filteredOptions[this.typeAheadPointer]
        t && this.selectable(t) && this.select(t)
      },
      typeAheadToLastSelected() {
        this.typeAheadPointer =
          this.selectedValue.length !== 0
            ? this.filteredOptions.indexOf(this.selectedValue[this.selectedValue.length - 1])
            : -1
      },
    },
  },
  J = {
    props: { loading: { type: Boolean, default: !1 } },
    data() {
      return { mutableLoading: !1 }
    },
    watch: {
      search() {
        this.$emit('search', this.search, this.toggleLoading)
      },
      loading(t) {
        this.mutableLoading = t
      },
    },
    methods: {
      toggleLoading(t = null) {
        return t == null ? (this.mutableLoading = !this.mutableLoading) : (this.mutableLoading = t)
      },
    },
  },
  S = (t, n) => {
    const o = t.__vccOpts || t
    for (const [s, r] of n) o[s] = r
    return o
  },
  H = {},
  X = { xmlns: 'http://www.w3.org/2000/svg', width: '10', height: '10' },
  Y = createBaseVNode(
    'path',
    {
      d: 'M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z',
    },
    null,
    -1,
  ),
  Q = [Y]
function G(t, n) {
  return openBlock(), createElementBlock('svg', X, Q)
}
const W = S(H, [['render', G]]),
  Z = {},
  ee = { xmlns: 'http://www.w3.org/2000/svg', width: '14', height: '10' },
  te = createBaseVNode(
    'path',
    {
      d: 'M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z',
    },
    null,
    -1,
  ),
  se = [te]
function ie(t, n) {
  return openBlock(), createElementBlock('svg', ee, se)
}
const oe = S(Z, [['render', ie]]),
  T = { Deselect: W, OpenIndicator: oe },
  ne = {
    mounted(t, { instance: n }) {
      if (n.appendToBody) {
        const { height: o, top: s, left: r, width: i } = n.$refs.toggle.getBoundingClientRect()
        let a = window.scrollX || window.pageXOffset,
          c = window.scrollY || window.pageYOffset
        ;(t.unbindPosition = n.calculatePosition(t, n, {
          width: i + 'px',
          left: a + r + 'px',
          top: c + s + o + 'px',
        })),
          document.body.appendChild(t)
      }
    },
    unmounted(t, { instance: n }) {
      n.appendToBody &&
        (t.unbindPosition && typeof t.unbindPosition == 'function' && t.unbindPosition(),
        t.parentNode && t.parentNode.removeChild(t))
    },
  }
function le(t) {
  const n = {}
  return (
    Object.keys(t)
      .sort()
      .forEach((o) => {
        n[o] = t[o]
      }),
    JSON.stringify(n)
  )
}
let ae = 0
function re() {
  return ++ae
}
const de = {
    components: f({}, T),
    directives: { appendToBody: ne },
    mixins: [U, q, J],
    compatConfig: { MODE: 3 },
    emits: [
      'open',
      'close',
      'update:modelValue',
      'search',
      'search:compositionstart',
      'search:compositionend',
      'search:keydown',
      'search:blur',
      'search:focus',
      'search:input',
      'option:created',
      'option:selecting',
      'option:selected',
      'option:deselecting',
      'option:deselected',
    ],
    props: {
      modelValue: {},
      components: { type: Object, default: () => ({}) },
      options: {
        type: Array,
        default() {
          return []
        },
      },
      disabled: { type: Boolean, default: !1 },
      clearable: { type: Boolean, default: !0 },
      deselectFromDropdown: { type: Boolean, default: !1 },
      searchable: { type: Boolean, default: !0 },
      multiple: { type: Boolean, default: !1 },
      placeholder: { type: String, default: '' },
      transition: { type: String, default: 'vs__fade' },
      clearSearchOnSelect: { type: Boolean, default: !0 },
      closeOnSelect: { type: Boolean, default: !0 },
      label: { type: String, default: 'label' },
      autocomplete: { type: String, default: 'off' },
      reduce: { type: Function, default: (t) => t },
      selectable: { type: Function, default: (t) => !0 },
      getOptionLabel: {
        type: Function,
        default(t) {
          return typeof t == 'object'
            ? t.hasOwnProperty(this.label)
              ? t[this.label]
              : console.warn(`[vue-select warn]: Label key "option.${this.label}" does not exist in options object ${JSON.stringify(t)}.
https://vue-select.org/api/props.html#getoptionlabel`)
            : t
        },
      },
      getOptionKey: {
        type: Function,
        default(t) {
          if (typeof t != 'object') return t
          try {
            return t.hasOwnProperty('id') ? t.id : le(t)
          } catch (n) {
            return console.warn(
              `[vue-select warn]: Could not stringify this option to generate unique key. Please provide'getOptionKey' prop to return a unique key for each option.
https://vue-select.org/api/props.html#getoptionkey`,
              t,
              n,
            )
          }
        },
      },
      onTab: {
        type: Function,
        default: function () {
          this.selectOnTab && !this.isComposing && this.typeAheadSelect()
        },
      },
      taggable: { type: Boolean, default: !1 },
      tabindex: { type: Number, default: null },
      pushTags: { type: Boolean, default: !1 },
      filterable: { type: Boolean, default: !0 },
      filterBy: {
        type: Function,
        default(t, n, o) {
          return (n || '').toLocaleLowerCase().indexOf(o.toLocaleLowerCase()) > -1
        },
      },
      filter: {
        type: Function,
        default(t, n) {
          return t.filter((o) => {
            let s = this.getOptionLabel(o)
            return typeof s == 'number' && (s = s.toString()), this.filterBy(o, s, n)
          })
        },
      },
      createOption: {
        type: Function,
        default(t) {
          return typeof this.optionList[0] == 'object' ? { [this.label]: t } : t
        },
      },
      resetOnOptionsChange: {
        default: !1,
        validator: (t) => ['function', 'boolean'].includes(typeof t),
      },
      clearSearchOnBlur: {
        type: Function,
        default: function ({ clearSearchOnSelect: t, multiple: n }) {
          return t && !n
        },
      },
      noDrop: { type: Boolean, default: !1 },
      inputId: { type: String },
      dir: { type: String, default: 'auto' },
      selectOnTab: { type: Boolean, default: !1 },
      selectOnKeyCodes: { type: Array, default: () => [13] },
      searchInputQuerySelector: { type: String, default: '[type=search]' },
      mapKeydown: { type: Function, default: (t, n) => t },
      appendToBody: { type: Boolean, default: !1 },
      calculatePosition: {
        type: Function,
        default(t, n, { width: o, top: s, left: r }) {
          ;(t.style.top = s), (t.style.left = r), (t.style.width = o)
        },
      },
      dropdownShouldOpen: {
        type: Function,
        default({ noDrop: t, open: n, mutableLoading: o }) {
          return t ? !1 : n && !o
        },
      },
      uid: { type: [String, Number], default: () => re() },
    },
    data() {
      return {
        search: '',
        open: !1,
        isComposing: !1,
        pushedTags: [],
        _value: [],
        deselectButtons: [],
      }
    },
    computed: {
      isReducingValues() {
        return this.$props.reduce !== this.$options.props.reduce.default
      },
      isTrackingValues() {
        return typeof this.modelValue > 'u' || this.isReducingValues
      },
      selectedValue() {
        let t = this.modelValue
        return (
          this.isTrackingValues && (t = this.$data._value),
          t != null && t !== '' ? [].concat(t) : []
        )
      },
      optionList() {
        return this.options.concat(this.pushTags ? this.pushedTags : [])
      },
      searchEl() {
        return this.$slots.search
          ? this.$refs.selectedOptions.querySelector(this.searchInputQuerySelector)
          : this.$refs.search
      },
      scope() {
        const t = {
          search: this.search,
          loading: this.loading,
          searching: this.searching,
          filteredOptions: this.filteredOptions,
        }
        return {
          search: {
            attributes: f(
              {
                disabled: this.disabled,
                placeholder: this.searchPlaceholder,
                tabindex: this.tabindex,
                readonly: !this.searchable,
                id: this.inputId,
                'aria-autocomplete': 'list',
                'aria-labelledby': `vs${this.uid}__combobox`,
                'aria-controls': `vs${this.uid}__listbox`,
                ref: 'search',
                type: 'search',
                autocomplete: this.autocomplete,
                value: this.search,
              },
              this.dropdownOpen && this.filteredOptions[this.typeAheadPointer]
                ? { 'aria-activedescendant': `vs${this.uid}__option-${this.typeAheadPointer}` }
                : {},
            ),
            events: {
              compositionstart: () => (this.isComposing = !0),
              compositionend: () => (this.isComposing = !1),
              keydown: this.onSearchKeyDown,
              blur: this.onSearchBlur,
              focus: this.onSearchFocus,
              input: (n) => (this.search = n.target.value),
            },
          },
          spinner: { loading: this.mutableLoading },
          noOptions: {
            search: this.search,
            loading: this.mutableLoading,
            searching: this.searching,
          },
          openIndicator: {
            attributes: { ref: 'openIndicator', role: 'presentation', class: 'vs__open-indicator' },
          },
          listHeader: t,
          listFooter: t,
          header: m(f({}, t), { deselect: this.deselect }),
          footer: m(f({}, t), { deselect: this.deselect }),
        }
      },
      childComponents() {
        return f(f({}, T), this.components)
      },
      stateClasses() {
        return {
          'vs--open': this.dropdownOpen,
          'vs--single': !this.multiple,
          'vs--multiple': this.multiple,
          'vs--searching': this.searching && !this.noDrop,
          'vs--searchable': this.searchable && !this.noDrop,
          'vs--unsearchable': !this.searchable,
          'vs--loading': this.mutableLoading,
          'vs--disabled': this.disabled,
        }
      },
      searching() {
        return !!this.search
      },
      dropdownOpen() {
        return this.dropdownShouldOpen(this)
      },
      searchPlaceholder() {
        return this.isValueEmpty && this.placeholder ? this.placeholder : void 0
      },
      filteredOptions() {
        const t = [].concat(this.optionList)
        if (!this.filterable && !this.taggable) return t
        const n = this.search.length ? this.filter(t, this.search, this) : t
        if (this.taggable && this.search.length) {
          const o = this.createOption(this.search)
          this.optionExists(o) || n.unshift(o)
        }
        return n
      },
      isValueEmpty() {
        return this.selectedValue.length === 0
      },
      showClearButton() {
        return !this.multiple && this.clearable && !this.open && !this.isValueEmpty
      },
    },
    watch: {
      options(t, n) {
        const o = () =>
          typeof this.resetOnOptionsChange == 'function'
            ? this.resetOnOptionsChange(t, n, this.selectedValue)
            : this.resetOnOptionsChange
        !this.taggable && o() && this.clearSelection(),
          this.modelValue &&
            this.isTrackingValues &&
            this.setInternalValueFromOptions(this.modelValue)
      },
      modelValue: {
        immediate: !0,
        handler(t) {
          this.isTrackingValues && this.setInternalValueFromOptions(t)
        },
      },
      multiple() {
        this.clearSelection()
      },
      open(t) {
        this.$emit(t ? 'open' : 'close')
      },
    },
    created() {
      this.mutableLoading = this.loading
    },
    methods: {
      setInternalValueFromOptions(t) {
        Array.isArray(t)
          ? (this.$data._value = t.map((n) => this.findOptionFromReducedValue(n)))
          : (this.$data._value = this.findOptionFromReducedValue(t))
      },
      select(t) {
        this.$emit('option:selecting', t),
          this.isOptionSelected(t)
            ? this.deselectFromDropdown &&
              (this.clearable || (this.multiple && this.selectedValue.length > 1)) &&
              this.deselect(t)
            : (this.taggable &&
                !this.optionExists(t) &&
                (this.$emit('option:created', t), this.pushTag(t)),
              this.multiple && (t = this.selectedValue.concat(t)),
              this.updateValue(t),
              this.$emit('option:selected', t)),
          this.onAfterSelect(t)
      },
      deselect(t) {
        this.$emit('option:deselecting', t),
          this.updateValue(this.selectedValue.filter((n) => !this.optionComparator(n, t))),
          this.$emit('option:deselected', t)
      },
      clearSelection() {
        this.updateValue(this.multiple ? [] : null)
      },
      onAfterSelect(t) {
        this.closeOnSelect && ((this.open = !this.open), this.searchEl.blur()),
          this.clearSearchOnSelect && (this.search = '')
      },
      updateValue(t) {
        typeof this.modelValue > 'u' && (this.$data._value = t),
          t !== null &&
            (Array.isArray(t) ? (t = t.map((n) => this.reduce(n))) : (t = this.reduce(t))),
          this.$emit('update:modelValue', t)
      },
      toggleDropdown(t) {
        const n = t.target !== this.searchEl
        n && t.preventDefault()
        const o = [...(this.deselectButtons || []), this.$refs.clearButton]
        if (
          this.searchEl === void 0 ||
          o.filter(Boolean).some((s) => s.contains(t.target) || s === t.target)
        ) {
          t.preventDefault()
          return
        }
        this.open && n
          ? this.searchEl.blur()
          : this.disabled || ((this.open = !0), this.searchEl.focus())
      },
      isOptionSelected(t) {
        return this.selectedValue.some((n) => this.optionComparator(n, t))
      },
      isOptionDeselectable(t) {
        return this.isOptionSelected(t) && this.deselectFromDropdown
      },
      optionComparator(t, n) {
        return this.getOptionKey(t) === this.getOptionKey(n)
      },
      findOptionFromReducedValue(t) {
        const n = (s) => JSON.stringify(this.reduce(s)) === JSON.stringify(t),
          o = [...this.options, ...this.pushedTags].filter(n)
        return o.length === 1
          ? o[0]
          : o.find((s) => this.optionComparator(s, this.$data._value)) || t
      },
      closeSearchOptions() {
        ;(this.open = !1), this.$emit('search:blur')
      },
      maybeDeleteValue() {
        if (
          !this.searchEl.value.length &&
          this.selectedValue &&
          this.selectedValue.length &&
          this.clearable
        ) {
          let t = null
          this.multiple && (t = [...this.selectedValue.slice(0, this.selectedValue.length - 1)]),
            this.updateValue(t)
        }
      },
      optionExists(t) {
        return this.optionList.some((n) => this.optionComparator(n, t))
      },
      normalizeOptionForSlot(t) {
        return typeof t == 'object' ? t : { [this.label]: t }
      },
      pushTag(t) {
        this.pushedTags.push(t)
      },
      onEscape() {
        this.search.length ? (this.search = '') : this.searchEl.blur()
      },
      onSearchBlur() {
        if (this.mousedown && !this.searching) this.mousedown = !1
        else {
          const { clearSearchOnSelect: t, multiple: n } = this
          this.clearSearchOnBlur({ clearSearchOnSelect: t, multiple: n }) && (this.search = ''),
            this.closeSearchOptions()
          return
        }
        if (this.search.length === 0 && this.options.length === 0) {
          this.closeSearchOptions()
          return
        }
      },
      onSearchFocus() {
        ;(this.open = !0), this.$emit('search:focus')
      },
      onMousedown() {
        this.mousedown = !0
      },
      onMouseUp() {
        this.mousedown = !1
      },
      onSearchKeyDown(t) {
        const n = (r) => (r.preventDefault(), !this.isComposing && this.typeAheadSelect()),
          o = {
            8: (r) => this.maybeDeleteValue(),
            9: (r) => this.onTab(),
            27: (r) => this.onEscape(),
            38: (r) => (r.preventDefault(), this.typeAheadUp()),
            40: (r) => (r.preventDefault(), this.typeAheadDown()),
          }
        this.selectOnKeyCodes.forEach((r) => (o[r] = n))
        const s = this.mapKeydown(o, this)
        if (typeof s[t.keyCode] == 'function') return s[t.keyCode](t)
      },
    },
  },
  he = ['dir'],
  ce = ['id', 'aria-expanded', 'aria-owns'],
  ue = { ref: 'selectedOptions', class: 'vs__selected-options' },
  pe = ['disabled', 'title', 'aria-label', 'onClick'],
  fe = { ref: 'actions', class: 'vs__actions' },
  ge = ['disabled'],
  ye = { class: 'vs__spinner' },
  me = ['id'],
  be = ['id', 'aria-selected', 'onMouseover', 'onClick'],
  _e = { key: 0, class: 'vs__no-options' },
  Oe = createTextVNode(' Sorry, no matching options. '),
  we = ['id']
function ve(t, n, o, s, r, i) {
  const a = resolveDirective('append-to-body')
  return (
    openBlock(),
    createElementBlock(
      'div',
      { dir: o.dir, class: normalizeClass(['v-select', i.stateClasses]) },
      [
        renderSlot(t.$slots, 'header', normalizeProps(guardReactiveProps(i.scope.header))),
        createBaseVNode(
          'div',
          {
            id: `vs${o.uid}__combobox`,
            ref: 'toggle',
            class: 'vs__dropdown-toggle',
            role: 'combobox',
            'aria-expanded': i.dropdownOpen.toString(),
            'aria-owns': `vs${o.uid}__listbox`,
            'aria-label': 'Search for option',
            onMousedown: n[1] || (n[1] = (c) => i.toggleDropdown(c)),
          },
          [
            createBaseVNode(
              'div',
              ue,
              [
                (openBlock(!0),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(i.selectedValue, (c, u) =>
                    renderSlot(
                      t.$slots,
                      'selected-option-container',
                      {
                        option: i.normalizeOptionForSlot(c),
                        deselect: i.deselect,
                        multiple: o.multiple,
                        disabled: o.disabled,
                      },
                      () => [
                        (openBlock(),
                        createElementBlock(
                          'span',
                          { key: o.getOptionKey(c), class: 'vs__selected' },
                          [
                            renderSlot(
                              t.$slots,
                              'selected-option',
                              normalizeProps(guardReactiveProps(i.normalizeOptionForSlot(c))),
                              () => [createTextVNode(toDisplayString(o.getOptionLabel(c)), 1)],
                            ),
                            o.multiple
                              ? (openBlock(),
                                createElementBlock(
                                  'button',
                                  {
                                    key: 0,
                                    ref_for: !0,
                                    ref: (g) => (r.deselectButtons[u] = g),
                                    disabled: o.disabled,
                                    type: 'button',
                                    class: 'vs__deselect',
                                    title: `Deselect ${o.getOptionLabel(c)}`,
                                    'aria-label': `Deselect ${o.getOptionLabel(c)}`,
                                    onClick: (g) => i.deselect(c),
                                  },
                                  [
                                    (openBlock(),
                                    createBlock(
                                      resolveDynamicComponent(i.childComponents.Deselect),
                                    )),
                                  ],
                                  8,
                                  pe,
                                ))
                              : createCommentVNode('', !0),
                          ],
                        )),
                      ],
                    ),
                  ),
                  256,
                )),
                renderSlot(
                  t.$slots,
                  'search',
                  normalizeProps(guardReactiveProps(i.scope.search)),
                  () => [
                    createBaseVNode(
                      'input',
                      mergeProps(
                        { class: 'vs__search' },
                        i.scope.search.attributes,
                        toHandlers(i.scope.search.events),
                      ),
                      null,
                      16,
                    ),
                  ],
                ),
              ],
              512,
            ),
            createBaseVNode(
              'div',
              fe,
              [
                withDirectives(
                  createBaseVNode(
                    'button',
                    {
                      ref: 'clearButton',
                      disabled: o.disabled,
                      type: 'button',
                      class: 'vs__clear',
                      title: 'Clear Selected',
                      'aria-label': 'Clear Selected',
                      onClick:
                        n[0] || (n[0] = (...c) => i.clearSelection && i.clearSelection(...c)),
                    },
                    [
                      (openBlock(),
                      createBlock(resolveDynamicComponent(i.childComponents.Deselect))),
                    ],
                    8,
                    ge,
                  ),
                  [[vShow, i.showClearButton]],
                ),
                renderSlot(
                  t.$slots,
                  'open-indicator',
                  normalizeProps(guardReactiveProps(i.scope.openIndicator)),
                  () => [
                    o.noDrop
                      ? createCommentVNode('', !0)
                      : (openBlock(),
                        createBlock(
                          resolveDynamicComponent(i.childComponents.OpenIndicator),
                          normalizeProps(mergeProps({ key: 0 }, i.scope.openIndicator.attributes)),
                          null,
                          16,
                        )),
                  ],
                ),
                renderSlot(
                  t.$slots,
                  'spinner',
                  normalizeProps(guardReactiveProps(i.scope.spinner)),
                  () => [
                    withDirectives(createBaseVNode('div', ye, 'Loading...', 512), [
                      [vShow, t.mutableLoading],
                    ]),
                  ],
                ),
              ],
              512,
            ),
          ],
          40,
          ce,
        ),
        createVNode(
          Transition,
          { name: o.transition },
          {
            default: withCtx(() => [
              i.dropdownOpen
                ? withDirectives(
                    (openBlock(),
                    createElementBlock(
                      'ul',
                      {
                        id: `vs${o.uid}__listbox`,
                        ref: 'dropdownMenu',
                        key: `vs${o.uid}__listbox`,
                        class: 'vs__dropdown-menu',
                        role: 'listbox',
                        tabindex: '-1',
                        onMousedown:
                          n[2] ||
                          (n[2] = withModifiers(
                            (...c) => i.onMousedown && i.onMousedown(...c),
                            ['prevent'],
                          )),
                        onMouseup: n[3] || (n[3] = (...c) => i.onMouseUp && i.onMouseUp(...c)),
                      },
                      [
                        renderSlot(
                          t.$slots,
                          'list-header',
                          normalizeProps(guardReactiveProps(i.scope.listHeader)),
                        ),
                        (openBlock(!0),
                        createElementBlock(
                          Fragment,
                          null,
                          renderList(
                            i.filteredOptions,
                            (c, u) => (
                              openBlock(),
                              createElementBlock(
                                'li',
                                {
                                  id: `vs${o.uid}__option-${u}`,
                                  key: o.getOptionKey(c),
                                  role: 'option',
                                  class: normalizeClass([
                                    'vs__dropdown-option',
                                    {
                                      'vs__dropdown-option--deselect':
                                        i.isOptionDeselectable(c) && u === t.typeAheadPointer,
                                      'vs__dropdown-option--selected': i.isOptionSelected(c),
                                      'vs__dropdown-option--highlight': u === t.typeAheadPointer,
                                      'vs__dropdown-option--disabled': !o.selectable(c),
                                    },
                                  ]),
                                  'aria-selected': u === t.typeAheadPointer ? !0 : null,
                                  onMouseover: (g) =>
                                    o.selectable(c) ? (t.typeAheadPointer = u) : null,
                                  onClick: withModifiers(
                                    (g) => (o.selectable(c) ? i.select(c) : null),
                                    ['prevent', 'stop'],
                                  ),
                                },
                                [
                                  renderSlot(
                                    t.$slots,
                                    'option',
                                    normalizeProps(guardReactiveProps(i.normalizeOptionForSlot(c))),
                                    () => [
                                      createTextVNode(toDisplayString(o.getOptionLabel(c)), 1),
                                    ],
                                  ),
                                ],
                                42,
                                be,
                              )
                            ),
                          ),
                          128,
                        )),
                        i.filteredOptions.length === 0
                          ? (openBlock(),
                            createElementBlock('li', _e, [
                              renderSlot(
                                t.$slots,
                                'no-options',
                                normalizeProps(guardReactiveProps(i.scope.noOptions)),
                                () => [Oe],
                              ),
                            ]))
                          : createCommentVNode('', !0),
                        renderSlot(
                          t.$slots,
                          'list-footer',
                          normalizeProps(guardReactiveProps(i.scope.listFooter)),
                        ),
                      ],
                      40,
                      me,
                    )),
                    [[a]],
                  )
                : (openBlock(),
                  createElementBlock(
                    'ul',
                    {
                      key: 1,
                      id: `vs${o.uid}__listbox`,
                      role: 'listbox',
                      style: { display: 'none', visibility: 'hidden' },
                    },
                    null,
                    8,
                    we,
                  )),
            ]),
            _: 3,
          },
          8,
          ['name'],
        ),
        renderSlot(t.$slots, 'footer', normalizeProps(guardReactiveProps(i.scope.footer))),
      ],
      10,
      he,
    )
  )
}
const Ce = S(de, [['render', ve]])
/*!
 * pinia v3.0.3
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */ let activePinia
const setActivePinia = (t) => (activePinia = t),
  piniaSymbol = Symbol()
function isPlainObject(t) {
  return (
    t &&
    typeof t == 'object' &&
    Object.prototype.toString.call(t) === '[object Object]' &&
    typeof t.toJSON != 'function'
  )
}
var MutationType
;(function (t) {
  ;(t.direct = 'direct'), (t.patchObject = 'patch object'), (t.patchFunction = 'patch function')
})(MutationType || (MutationType = {}))
function createPinia() {
  const t = effectScope(!0),
    n = t.run(() => ref({}))
  let o = [],
    s = []
  const r = markRaw({
    install(i) {
      setActivePinia(r),
        (r._a = i),
        i.provide(piniaSymbol, r),
        (i.config.globalProperties.$pinia = r),
        s.forEach((a) => o.push(a)),
        (s = [])
    },
    use(i) {
      return this._a ? o.push(i) : s.push(i), this
    },
    _p: o,
    _a: null,
    _e: t,
    _s: new Map(),
    state: n,
  })
  return r
}
const noop$1 = () => {}
function addSubscription(t, n, o, s = noop$1) {
  t.push(n)
  const r = () => {
    const i = t.indexOf(n)
    i > -1 && (t.splice(i, 1), s())
  }
  return !o && getCurrentScope() && onScopeDispose(r), r
}
function triggerSubscriptions(t, ...n) {
  t.slice().forEach((o) => {
    o(...n)
  })
}
const fallbackRunWithContext = (t) => t(),
  ACTION_MARKER = Symbol(),
  ACTION_NAME = Symbol()
function mergeReactiveObjects(t, n) {
  t instanceof Map && n instanceof Map
    ? n.forEach((o, s) => t.set(s, o))
    : t instanceof Set && n instanceof Set && n.forEach(t.add, t)
  for (const o in n) {
    if (!n.hasOwnProperty(o)) continue
    const s = n[o],
      r = t[o]
    isPlainObject(r) && isPlainObject(s) && t.hasOwnProperty(o) && !isRef(s) && !isReactive(s)
      ? (t[o] = mergeReactiveObjects(r, s))
      : (t[o] = s)
  }
  return t
}
const skipHydrateSymbol = Symbol()
function shouldHydrate(t) {
  return !isPlainObject(t) || !Object.prototype.hasOwnProperty.call(t, skipHydrateSymbol)
}
const { assign: assign$1 } = Object
function isComputed(t) {
  return !!(isRef(t) && t.effect)
}
function createOptionsStore(t, n, o, s) {
  const { state: r, actions: i, getters: a } = n,
    c = o.state.value[t]
  let u
  function g() {
    c || (o.state.value[t] = r ? r() : {})
    const d = toRefs(o.state.value[t])
    return assign$1(
      d,
      i,
      Object.keys(a || {}).reduce(
        (v, y) => (
          (v[y] = markRaw(
            computed(() => {
              setActivePinia(o)
              const _ = o._s.get(t)
              return a[y].call(_, _)
            }),
          )),
          v
        ),
        {},
      ),
    )
  }
  return (u = createSetupStore(t, g, n, o, s, !0)), u
}
function createSetupStore(t, n, o = {}, s, r, i) {
  let a
  const c = assign$1({ actions: {} }, o),
    u = { deep: !0 }
  let g,
    d,
    v = [],
    y = [],
    _
  const $ = s.state.value[t]
  !i && !$ && (s.state.value[t] = {}), ref({})
  let A
  function k(L) {
    let R
    ;(g = d = !1),
      typeof L == 'function'
        ? (L(s.state.value[t]), (R = { type: MutationType.patchFunction, storeId: t, events: _ }))
        : (mergeReactiveObjects(s.state.value[t], L),
          (R = { type: MutationType.patchObject, payload: L, storeId: t, events: _ }))
    const D = (A = Symbol())
    nextTick().then(() => {
      A === D && (g = !0)
    }),
      (d = !0),
      triggerSubscriptions(v, R, s.state.value[t])
  }
  const O = i
    ? function () {
        const { state: R } = o,
          D = R ? R() : {}
        this.$patch((Te) => {
          assign$1(Te, D)
        })
      }
    : noop$1
  function j() {
    a.stop(), (v = []), (y = []), s._s.delete(t)
  }
  const B = (L, R = '') => {
      if (ACTION_MARKER in L) return (L[ACTION_NAME] = R), L
      const D = function () {
        setActivePinia(s)
        const Te = Array.from(arguments),
          K = [],
          De = []
        function je(Ze) {
          K.push(Ze)
        }
        function Pe(Ze) {
          De.push(Ze)
        }
        triggerSubscriptions(y, {
          args: Te,
          name: D[ACTION_NAME],
          store: F,
          after: je,
          onError: Pe,
        })
        let xe
        try {
          xe = L.apply(this && this.$id === t ? this : F, Te)
        } catch (Ze) {
          throw (triggerSubscriptions(De, Ze), Ze)
        }
        return xe instanceof Promise
          ? xe
              .then((Ze) => (triggerSubscriptions(K, Ze), Ze))
              .catch((Ze) => (triggerSubscriptions(De, Ze), Promise.reject(Ze)))
          : (triggerSubscriptions(K, xe), xe)
      }
      return (D[ACTION_MARKER] = !0), (D[ACTION_NAME] = R), D
    },
    P = {
      _p: s,
      $id: t,
      $onAction: addSubscription.bind(null, y),
      $patch: k,
      $reset: O,
      $subscribe(L, R = {}) {
        const D = addSubscription(v, L, R.detached, () => Te()),
          Te = a.run(() =>
            watch(
              () => s.state.value[t],
              (K) => {
                ;(R.flush === 'sync' ? d : g) &&
                  L({ storeId: t, type: MutationType.direct, events: _ }, K)
              },
              assign$1({}, u, R),
            ),
          )
        return D
      },
      $dispose: j,
    },
    F = reactive(P)
  s._s.set(t, F)
  const Se = ((s._a && s._a.runWithContext) || fallbackRunWithContext)(() =>
    s._e.run(() => (a = effectScope()).run(() => n({ action: B }))),
  )
  for (const L in Se) {
    const R = Se[L]
    if ((isRef(R) && !isComputed(R)) || isReactive(R))
      i ||
        ($ && shouldHydrate(R) && (isRef(R) ? (R.value = $[L]) : mergeReactiveObjects(R, $[L])),
        (s.state.value[t][L] = R))
    else if (typeof R == 'function') {
      const D = B(R, L)
      ;(Se[L] = D), (c.actions[L] = R)
    }
  }
  return (
    assign$1(F, Se),
    assign$1(toRaw(F), Se),
    Object.defineProperty(F, '$state', {
      get: () => s.state.value[t],
      set: (L) => {
        k((R) => {
          assign$1(R, L)
        })
      },
    }),
    s._p.forEach((L) => {
      assign$1(
        F,
        a.run(() => L({ store: F, app: s._a, pinia: s, options: c })),
      )
    }),
    $ && i && o.hydrate && o.hydrate(F.$state, $),
    (g = !0),
    (d = !0),
    F
  )
}
/*! #__NO_SIDE_EFFECTS__ */ function defineStore(t, n, o) {
  let s
  const r = typeof n == 'function'
  s = r ? o : n
  function i(a, c) {
    const u = hasInjectionContext()
    return (
      (a = a || (u ? inject(piniaSymbol, null) : null)),
      a && setActivePinia(a),
      (a = activePinia),
      a._s.has(t) || (r ? createSetupStore(t, n, s, a) : createOptionsStore(t, s, a)),
      a._s.get(t)
    )
  }
  return (i.$id = t), i
}
const _imports_0$1 = '/assets/logo-darkmode-B_KpkS75.svg'
/*!
 * vue-router v4.5.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */ const isBrowser = typeof document < 'u'
function isRouteComponent(t) {
  return typeof t == 'object' || 'displayName' in t || 'props' in t || '__vccOpts' in t
}
function isESModule(t) {
  return (
    t.__esModule || t[Symbol.toStringTag] === 'Module' || (t.default && isRouteComponent(t.default))
  )
}
const assign = Object.assign
function applyToParams(t, n) {
  const o = {}
  for (const s in n) {
    const r = n[s]
    o[s] = isArray(r) ? r.map(t) : t(r)
  }
  return o
}
const noop = () => {},
  isArray = Array.isArray,
  HASH_RE = /#/g,
  AMPERSAND_RE = /&/g,
  SLASH_RE = /\//g,
  EQUAL_RE = /=/g,
  IM_RE = /\?/g,
  PLUS_RE = /\+/g,
  ENC_BRACKET_OPEN_RE = /%5B/g,
  ENC_BRACKET_CLOSE_RE = /%5D/g,
  ENC_CARET_RE = /%5E/g,
  ENC_BACKTICK_RE = /%60/g,
  ENC_CURLY_OPEN_RE = /%7B/g,
  ENC_PIPE_RE = /%7C/g,
  ENC_CURLY_CLOSE_RE = /%7D/g,
  ENC_SPACE_RE = /%20/g
function commonEncode(t) {
  return encodeURI('' + t)
    .replace(ENC_PIPE_RE, '|')
    .replace(ENC_BRACKET_OPEN_RE, '[')
    .replace(ENC_BRACKET_CLOSE_RE, ']')
}
function encodeHash(t) {
  return commonEncode(t)
    .replace(ENC_CURLY_OPEN_RE, '{')
    .replace(ENC_CURLY_CLOSE_RE, '}')
    .replace(ENC_CARET_RE, '^')
}
function encodeQueryValue(t) {
  return commonEncode(t)
    .replace(PLUS_RE, '%2B')
    .replace(ENC_SPACE_RE, '+')
    .replace(HASH_RE, '%23')
    .replace(AMPERSAND_RE, '%26')
    .replace(ENC_BACKTICK_RE, '`')
    .replace(ENC_CURLY_OPEN_RE, '{')
    .replace(ENC_CURLY_CLOSE_RE, '}')
    .replace(ENC_CARET_RE, '^')
}
function encodeQueryKey(t) {
  return encodeQueryValue(t).replace(EQUAL_RE, '%3D')
}
function encodePath(t) {
  return commonEncode(t).replace(HASH_RE, '%23').replace(IM_RE, '%3F')
}
function encodeParam(t) {
  return t == null ? '' : encodePath(t).replace(SLASH_RE, '%2F')
}
function decode(t) {
  try {
    return decodeURIComponent('' + t)
  } catch {}
  return '' + t
}
const TRAILING_SLASH_RE = /\/$/,
  removeTrailingSlash = (t) => t.replace(TRAILING_SLASH_RE, '')
function parseURL(t, n, o = '/') {
  let s,
    r = {},
    i = '',
    a = ''
  const c = n.indexOf('#')
  let u = n.indexOf('?')
  return (
    c < u && c >= 0 && (u = -1),
    u > -1 && ((s = n.slice(0, u)), (i = n.slice(u + 1, c > -1 ? c : n.length)), (r = t(i))),
    c > -1 && ((s = s || n.slice(0, c)), (a = n.slice(c, n.length))),
    (s = resolveRelativePath(s ?? n, o)),
    { fullPath: s + (i && '?') + i + a, path: s, query: r, hash: decode(a) }
  )
}
function stringifyURL(t, n) {
  const o = n.query ? t(n.query) : ''
  return n.path + (o && '?') + o + (n.hash || '')
}
function stripBase(t, n) {
  return !n || !t.toLowerCase().startsWith(n.toLowerCase()) ? t : t.slice(n.length) || '/'
}
function isSameRouteLocation(t, n, o) {
  const s = n.matched.length - 1,
    r = o.matched.length - 1
  return (
    s > -1 &&
    s === r &&
    isSameRouteRecord(n.matched[s], o.matched[r]) &&
    isSameRouteLocationParams(n.params, o.params) &&
    t(n.query) === t(o.query) &&
    n.hash === o.hash
  )
}
function isSameRouteRecord(t, n) {
  return (t.aliasOf || t) === (n.aliasOf || n)
}
function isSameRouteLocationParams(t, n) {
  if (Object.keys(t).length !== Object.keys(n).length) return !1
  for (const o in t) if (!isSameRouteLocationParamsValue(t[o], n[o])) return !1
  return !0
}
function isSameRouteLocationParamsValue(t, n) {
  return isArray(t) ? isEquivalentArray(t, n) : isArray(n) ? isEquivalentArray(n, t) : t === n
}
function isEquivalentArray(t, n) {
  return isArray(n)
    ? t.length === n.length && t.every((o, s) => o === n[s])
    : t.length === 1 && t[0] === n
}
function resolveRelativePath(t, n) {
  if (t.startsWith('/')) return t
  if (!t) return n
  const o = n.split('/'),
    s = t.split('/'),
    r = s[s.length - 1]
  ;(r === '..' || r === '.') && s.push('')
  let i = o.length - 1,
    a,
    c
  for (a = 0; a < s.length; a++)
    if (((c = s[a]), c !== '.'))
      if (c === '..') i > 1 && i--
      else break
  return o.slice(0, i).join('/') + '/' + s.slice(a).join('/')
}
const START_LOCATION_NORMALIZED = {
  path: '/',
  name: void 0,
  params: {},
  query: {},
  hash: '',
  fullPath: '/',
  matched: [],
  meta: {},
  redirectedFrom: void 0,
}
var NavigationType
;(function (t) {
  ;(t.pop = 'pop'), (t.push = 'push')
})(NavigationType || (NavigationType = {}))
var NavigationDirection
;(function (t) {
  ;(t.back = 'back'), (t.forward = 'forward'), (t.unknown = '')
})(NavigationDirection || (NavigationDirection = {}))
function normalizeBase(t) {
  if (!t)
    if (isBrowser) {
      const n = document.querySelector('base')
      ;(t = (n && n.getAttribute('href')) || '/'), (t = t.replace(/^\w+:\/\/[^\/]+/, ''))
    } else t = '/'
  return t[0] !== '/' && t[0] !== '#' && (t = '/' + t), removeTrailingSlash(t)
}
const BEFORE_HASH_RE = /^[^#]+#/
function createHref(t, n) {
  return t.replace(BEFORE_HASH_RE, '#') + n
}
function getElementPosition(t, n) {
  const o = document.documentElement.getBoundingClientRect(),
    s = t.getBoundingClientRect()
  return {
    behavior: n.behavior,
    left: s.left - o.left - (n.left || 0),
    top: s.top - o.top - (n.top || 0),
  }
}
const computeScrollPosition = () => ({ left: window.scrollX, top: window.scrollY })
function scrollToPosition(t) {
  let n
  if ('el' in t) {
    const o = t.el,
      s = typeof o == 'string' && o.startsWith('#'),
      r =
        typeof o == 'string'
          ? s
            ? document.getElementById(o.slice(1))
            : document.querySelector(o)
          : o
    if (!r) return
    n = getElementPosition(r, t)
  } else n = t
  'scrollBehavior' in document.documentElement.style
    ? window.scrollTo(n)
    : window.scrollTo(
        n.left != null ? n.left : window.scrollX,
        n.top != null ? n.top : window.scrollY,
      )
}
function getScrollKey(t, n) {
  return (history.state ? history.state.position - n : -1) + t
}
const scrollPositions = new Map()
function saveScrollPosition(t, n) {
  scrollPositions.set(t, n)
}
function getSavedScrollPosition(t) {
  const n = scrollPositions.get(t)
  return scrollPositions.delete(t), n
}
let createBaseLocation = () => location.protocol + '//' + location.host
function createCurrentLocation(t, n) {
  const { pathname: o, search: s, hash: r } = n,
    i = t.indexOf('#')
  if (i > -1) {
    let c = r.includes(t.slice(i)) ? t.slice(i).length : 1,
      u = r.slice(c)
    return u[0] !== '/' && (u = '/' + u), stripBase(u, '')
  }
  return stripBase(o, t) + s + r
}
function useHistoryListeners(t, n, o, s) {
  let r = [],
    i = [],
    a = null
  const c = ({ state: y }) => {
    const _ = createCurrentLocation(t, location),
      $ = o.value,
      A = n.value
    let k = 0
    if (y) {
      if (((o.value = _), (n.value = y), a && a === $)) {
        a = null
        return
      }
      k = A ? y.position - A.position : 0
    } else s(_)
    r.forEach((O) => {
      O(o.value, $, {
        delta: k,
        type: NavigationType.pop,
        direction: k
          ? k > 0
            ? NavigationDirection.forward
            : NavigationDirection.back
          : NavigationDirection.unknown,
      })
    })
  }
  function u() {
    a = o.value
  }
  function g(y) {
    r.push(y)
    const _ = () => {
      const $ = r.indexOf(y)
      $ > -1 && r.splice($, 1)
    }
    return i.push(_), _
  }
  function d() {
    const { history: y } = window
    y.state && y.replaceState(assign({}, y.state, { scroll: computeScrollPosition() }), '')
  }
  function v() {
    for (const y of i) y()
    ;(i = []),
      window.removeEventListener('popstate', c),
      window.removeEventListener('beforeunload', d)
  }
  return (
    window.addEventListener('popstate', c),
    window.addEventListener('beforeunload', d, { passive: !0 }),
    { pauseListeners: u, listen: g, destroy: v }
  )
}
function buildState(t, n, o, s = !1, r = !1) {
  return {
    back: t,
    current: n,
    forward: o,
    replaced: s,
    position: window.history.length,
    scroll: r ? computeScrollPosition() : null,
  }
}
function useHistoryStateNavigation(t) {
  const { history: n, location: o } = window,
    s = { value: createCurrentLocation(t, o) },
    r = { value: n.state }
  r.value ||
    i(
      s.value,
      {
        back: null,
        current: s.value,
        forward: null,
        position: n.length - 1,
        replaced: !0,
        scroll: null,
      },
      !0,
    )
  function i(u, g, d) {
    const v = t.indexOf('#'),
      y =
        v > -1
          ? (o.host && document.querySelector('base') ? t : t.slice(v)) + u
          : createBaseLocation() + t + u
    try {
      n[d ? 'replaceState' : 'pushState'](g, '', y), (r.value = g)
    } catch (_) {
      console.error(_), o[d ? 'replace' : 'assign'](y)
    }
  }
  function a(u, g) {
    const d = assign({}, n.state, buildState(r.value.back, u, r.value.forward, !0), g, {
      position: r.value.position,
    })
    i(u, d, !0), (s.value = u)
  }
  function c(u, g) {
    const d = assign({}, r.value, n.state, { forward: u, scroll: computeScrollPosition() })
    i(d.current, d, !0)
    const v = assign({}, buildState(s.value, u, null), { position: d.position + 1 }, g)
    i(u, v, !1), (s.value = u)
  }
  return { location: s, state: r, push: c, replace: a }
}
function createWebHistory(t) {
  t = normalizeBase(t)
  const n = useHistoryStateNavigation(t),
    o = useHistoryListeners(t, n.state, n.location, n.replace)
  function s(i, a = !0) {
    a || o.pauseListeners(), history.go(i)
  }
  const r = assign({ location: '', base: t, go: s, createHref: createHref.bind(null, t) }, n, o)
  return (
    Object.defineProperty(r, 'location', { enumerable: !0, get: () => n.location.value }),
    Object.defineProperty(r, 'state', { enumerable: !0, get: () => n.state.value }),
    r
  )
}
function isRouteLocation(t) {
  return typeof t == 'string' || (t && typeof t == 'object')
}
function isRouteName(t) {
  return typeof t == 'string' || typeof t == 'symbol'
}
const NavigationFailureSymbol = Symbol('')
var NavigationFailureType
;(function (t) {
  ;(t[(t.aborted = 4)] = 'aborted'),
    (t[(t.cancelled = 8)] = 'cancelled'),
    (t[(t.duplicated = 16)] = 'duplicated')
})(NavigationFailureType || (NavigationFailureType = {}))
function createRouterError(t, n) {
  return assign(new Error(), { type: t, [NavigationFailureSymbol]: !0 }, n)
}
function isNavigationFailure(t, n) {
  return t instanceof Error && NavigationFailureSymbol in t && (n == null || !!(t.type & n))
}
const BASE_PARAM_PATTERN = '[^/]+?',
  BASE_PATH_PARSER_OPTIONS = { sensitive: !1, strict: !1, start: !0, end: !0 },
  REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g
function tokensToParser(t, n) {
  const o = assign({}, BASE_PATH_PARSER_OPTIONS, n),
    s = []
  let r = o.start ? '^' : ''
  const i = []
  for (const g of t) {
    const d = g.length ? [] : [90]
    o.strict && !g.length && (r += '/')
    for (let v = 0; v < g.length; v++) {
      const y = g[v]
      let _ = 40 + (o.sensitive ? 0.25 : 0)
      if (y.type === 0) v || (r += '/'), (r += y.value.replace(REGEX_CHARS_RE, '\\$&')), (_ += 40)
      else if (y.type === 1) {
        const { value: $, repeatable: A, optional: k, regexp: O } = y
        i.push({ name: $, repeatable: A, optional: k })
        const j = O || BASE_PARAM_PATTERN
        if (j !== BASE_PARAM_PATTERN) {
          _ += 10
          try {
            new RegExp(`(${j})`)
          } catch (P) {
            throw new Error(`Invalid custom RegExp for param "${$}" (${j}): ` + P.message)
          }
        }
        let B = A ? `((?:${j})(?:/(?:${j}))*)` : `(${j})`
        v || (B = k && g.length < 2 ? `(?:/${B})` : '/' + B),
          k && (B += '?'),
          (r += B),
          (_ += 20),
          k && (_ += -8),
          A && (_ += -20),
          j === '.*' && (_ += -50)
      }
      d.push(_)
    }
    s.push(d)
  }
  if (o.strict && o.end) {
    const g = s.length - 1
    s[g][s[g].length - 1] += 0.7000000000000001
  }
  o.strict || (r += '/?'), o.end ? (r += '$') : o.strict && !r.endsWith('/') && (r += '(?:/|$)')
  const a = new RegExp(r, o.sensitive ? '' : 'i')
  function c(g) {
    const d = g.match(a),
      v = {}
    if (!d) return null
    for (let y = 1; y < d.length; y++) {
      const _ = d[y] || '',
        $ = i[y - 1]
      v[$.name] = _ && $.repeatable ? _.split('/') : _
    }
    return v
  }
  function u(g) {
    let d = '',
      v = !1
    for (const y of t) {
      ;(!v || !d.endsWith('/')) && (d += '/'), (v = !1)
      for (const _ of y)
        if (_.type === 0) d += _.value
        else if (_.type === 1) {
          const { value: $, repeatable: A, optional: k } = _,
            O = $ in g ? g[$] : ''
          if (isArray(O) && !A)
            throw new Error(
              `Provided param "${$}" is an array but it is not repeatable (* or + modifiers)`,
            )
          const j = isArray(O) ? O.join('/') : O
          if (!j)
            if (k) y.length < 2 && (d.endsWith('/') ? (d = d.slice(0, -1)) : (v = !0))
            else throw new Error(`Missing required param "${$}"`)
          d += j
        }
    }
    return d || '/'
  }
  return { re: a, score: s, keys: i, parse: c, stringify: u }
}
function compareScoreArray(t, n) {
  let o = 0
  for (; o < t.length && o < n.length; ) {
    const s = n[o] - t[o]
    if (s) return s
    o++
  }
  return t.length < n.length
    ? t.length === 1 && t[0] === 80
      ? -1
      : 1
    : t.length > n.length
      ? n.length === 1 && n[0] === 80
        ? 1
        : -1
      : 0
}
function comparePathParserScore(t, n) {
  let o = 0
  const s = t.score,
    r = n.score
  for (; o < s.length && o < r.length; ) {
    const i = compareScoreArray(s[o], r[o])
    if (i) return i
    o++
  }
  if (Math.abs(r.length - s.length) === 1) {
    if (isLastScoreNegative(s)) return 1
    if (isLastScoreNegative(r)) return -1
  }
  return r.length - s.length
}
function isLastScoreNegative(t) {
  const n = t[t.length - 1]
  return t.length > 0 && n[n.length - 1] < 0
}
const ROOT_TOKEN = { type: 0, value: '' },
  VALID_PARAM_RE = /[a-zA-Z0-9_]/
function tokenizePath(t) {
  if (!t) return [[]]
  if (t === '/') return [[ROOT_TOKEN]]
  if (!t.startsWith('/')) throw new Error(`Invalid path "${t}"`)
  function n(_) {
    throw new Error(`ERR (${o})/"${g}": ${_}`)
  }
  let o = 0,
    s = o
  const r = []
  let i
  function a() {
    i && r.push(i), (i = [])
  }
  let c = 0,
    u,
    g = '',
    d = ''
  function v() {
    g &&
      (o === 0
        ? i.push({ type: 0, value: g })
        : o === 1 || o === 2 || o === 3
          ? (i.length > 1 &&
              (u === '*' || u === '+') &&
              n(`A repeatable param (${g}) must be alone in its segment. eg: '/:ids+.`),
            i.push({
              type: 1,
              value: g,
              regexp: d,
              repeatable: u === '*' || u === '+',
              optional: u === '*' || u === '?',
            }))
          : n('Invalid state to consume buffer'),
      (g = ''))
  }
  function y() {
    g += u
  }
  for (; c < t.length; ) {
    if (((u = t[c++]), u === '\\' && o !== 2)) {
      ;(s = o), (o = 4)
      continue
    }
    switch (o) {
      case 0:
        u === '/' ? (g && v(), a()) : u === ':' ? (v(), (o = 1)) : y()
        break
      case 4:
        y(), (o = s)
        break
      case 1:
        u === '('
          ? (o = 2)
          : VALID_PARAM_RE.test(u)
            ? y()
            : (v(), (o = 0), u !== '*' && u !== '?' && u !== '+' && c--)
        break
      case 2:
        u === ')' ? (d[d.length - 1] == '\\' ? (d = d.slice(0, -1) + u) : (o = 3)) : (d += u)
        break
      case 3:
        v(), (o = 0), u !== '*' && u !== '?' && u !== '+' && c--, (d = '')
        break
      default:
        n('Unknown state')
        break
    }
  }
  return o === 2 && n(`Unfinished custom RegExp for param "${g}"`), v(), a(), r
}
function createRouteRecordMatcher(t, n, o) {
  const s = tokensToParser(tokenizePath(t.path), o),
    r = assign(s, { record: t, parent: n, children: [], alias: [] })
  return n && !r.record.aliasOf == !n.record.aliasOf && n.children.push(r), r
}
function createRouterMatcher(t, n) {
  const o = [],
    s = new Map()
  n = mergeOptions({ strict: !1, end: !0, sensitive: !1 }, n)
  function r(v) {
    return s.get(v)
  }
  function i(v, y, _) {
    const $ = !_,
      A = normalizeRouteRecord(v)
    A.aliasOf = _ && _.record
    const k = mergeOptions(n, v),
      O = [A]
    if ('alias' in v) {
      const P = typeof v.alias == 'string' ? [v.alias] : v.alias
      for (const F of P)
        O.push(
          normalizeRouteRecord(
            assign({}, A, {
              components: _ ? _.record.components : A.components,
              path: F,
              aliasOf: _ ? _.record : A,
            }),
          ),
        )
    }
    let j, B
    for (const P of O) {
      const { path: F } = P
      if (y && F[0] !== '/') {
        const Be = y.record.path,
          Se = Be[Be.length - 1] === '/' ? '' : '/'
        P.path = y.record.path + (F && Se + F)
      }
      if (
        ((j = createRouteRecordMatcher(P, y, k)),
        _
          ? _.alias.push(j)
          : ((B = B || j),
            B !== j && B.alias.push(j),
            $ && v.name && !isAliasRecord(j) && a(v.name)),
        isMatchable(j) && u(j),
        A.children)
      ) {
        const Be = A.children
        for (let Se = 0; Se < Be.length; Se++) i(Be[Se], j, _ && _.children[Se])
      }
      _ = _ || j
    }
    return B
      ? () => {
          a(B)
        }
      : noop
  }
  function a(v) {
    if (isRouteName(v)) {
      const y = s.get(v)
      y && (s.delete(v), o.splice(o.indexOf(y), 1), y.children.forEach(a), y.alias.forEach(a))
    } else {
      const y = o.indexOf(v)
      y > -1 &&
        (o.splice(y, 1),
        v.record.name && s.delete(v.record.name),
        v.children.forEach(a),
        v.alias.forEach(a))
    }
  }
  function c() {
    return o
  }
  function u(v) {
    const y = findInsertionIndex(v, o)
    o.splice(y, 0, v), v.record.name && !isAliasRecord(v) && s.set(v.record.name, v)
  }
  function g(v, y) {
    let _,
      $ = {},
      A,
      k
    if ('name' in v && v.name) {
      if (((_ = s.get(v.name)), !_)) throw createRouterError(1, { location: v })
      ;(k = _.record.name),
        ($ = assign(
          paramsFromLocation(
            y.params,
            _.keys
              .filter((B) => !B.optional)
              .concat(_.parent ? _.parent.keys.filter((B) => B.optional) : [])
              .map((B) => B.name),
          ),
          v.params &&
            paramsFromLocation(
              v.params,
              _.keys.map((B) => B.name),
            ),
        )),
        (A = _.stringify($))
    } else if (v.path != null)
      (A = v.path), (_ = o.find((B) => B.re.test(A))), _ && (($ = _.parse(A)), (k = _.record.name))
    else {
      if (((_ = y.name ? s.get(y.name) : o.find((B) => B.re.test(y.path))), !_))
        throw createRouterError(1, { location: v, currentLocation: y })
      ;(k = _.record.name), ($ = assign({}, y.params, v.params)), (A = _.stringify($))
    }
    const O = []
    let j = _
    for (; j; ) O.unshift(j.record), (j = j.parent)
    return { name: k, path: A, params: $, matched: O, meta: mergeMetaFields(O) }
  }
  t.forEach((v) => i(v))
  function d() {
    ;(o.length = 0), s.clear()
  }
  return {
    addRoute: i,
    resolve: g,
    removeRoute: a,
    clearRoutes: d,
    getRoutes: c,
    getRecordMatcher: r,
  }
}
function paramsFromLocation(t, n) {
  const o = {}
  for (const s of n) s in t && (o[s] = t[s])
  return o
}
function normalizeRouteRecord(t) {
  const n = {
    path: t.path,
    redirect: t.redirect,
    name: t.name,
    meta: t.meta || {},
    aliasOf: t.aliasOf,
    beforeEnter: t.beforeEnter,
    props: normalizeRecordProps(t),
    children: t.children || [],
    instances: {},
    leaveGuards: new Set(),
    updateGuards: new Set(),
    enterCallbacks: {},
    components: 'components' in t ? t.components || null : t.component && { default: t.component },
  }
  return Object.defineProperty(n, 'mods', { value: {} }), n
}
function normalizeRecordProps(t) {
  const n = {},
    o = t.props || !1
  if ('component' in t) n.default = o
  else for (const s in t.components) n[s] = typeof o == 'object' ? o[s] : o
  return n
}
function isAliasRecord(t) {
  for (; t; ) {
    if (t.record.aliasOf) return !0
    t = t.parent
  }
  return !1
}
function mergeMetaFields(t) {
  return t.reduce((n, o) => assign(n, o.meta), {})
}
function mergeOptions(t, n) {
  const o = {}
  for (const s in t) o[s] = s in n ? n[s] : t[s]
  return o
}
function findInsertionIndex(t, n) {
  let o = 0,
    s = n.length
  for (; o !== s; ) {
    const i = (o + s) >> 1
    comparePathParserScore(t, n[i]) < 0 ? (s = i) : (o = i + 1)
  }
  const r = getInsertionAncestor(t)
  return r && (s = n.lastIndexOf(r, s - 1)), s
}
function getInsertionAncestor(t) {
  let n = t
  for (; (n = n.parent); ) if (isMatchable(n) && comparePathParserScore(t, n) === 0) return n
}
function isMatchable({ record: t }) {
  return !!(t.name || (t.components && Object.keys(t.components).length) || t.redirect)
}
function parseQuery(t) {
  const n = {}
  if (t === '' || t === '?') return n
  const s = (t[0] === '?' ? t.slice(1) : t).split('&')
  for (let r = 0; r < s.length; ++r) {
    const i = s[r].replace(PLUS_RE, ' '),
      a = i.indexOf('='),
      c = decode(a < 0 ? i : i.slice(0, a)),
      u = a < 0 ? null : decode(i.slice(a + 1))
    if (c in n) {
      let g = n[c]
      isArray(g) || (g = n[c] = [g]), g.push(u)
    } else n[c] = u
  }
  return n
}
function stringifyQuery(t) {
  let n = ''
  for (let o in t) {
    const s = t[o]
    if (((o = encodeQueryKey(o)), s == null)) {
      s !== void 0 && (n += (n.length ? '&' : '') + o)
      continue
    }
    ;(isArray(s) ? s.map((i) => i && encodeQueryValue(i)) : [s && encodeQueryValue(s)]).forEach(
      (i) => {
        i !== void 0 && ((n += (n.length ? '&' : '') + o), i != null && (n += '=' + i))
      },
    )
  }
  return n
}
function normalizeQuery(t) {
  const n = {}
  for (const o in t) {
    const s = t[o]
    s !== void 0 &&
      (n[o] = isArray(s) ? s.map((r) => (r == null ? null : '' + r)) : s == null ? s : '' + s)
  }
  return n
}
const matchedRouteKey = Symbol(''),
  viewDepthKey = Symbol(''),
  routerKey = Symbol(''),
  routeLocationKey = Symbol(''),
  routerViewLocationKey = Symbol('')
function useCallbacks() {
  let t = []
  function n(s) {
    return (
      t.push(s),
      () => {
        const r = t.indexOf(s)
        r > -1 && t.splice(r, 1)
      }
    )
  }
  function o() {
    t = []
  }
  return { add: n, list: () => t.slice(), reset: o }
}
function guardToPromiseFn(t, n, o, s, r, i = (a) => a()) {
  const a = s && (s.enterCallbacks[r] = s.enterCallbacks[r] || [])
  return () =>
    new Promise((c, u) => {
      const g = (y) => {
          y === !1
            ? u(createRouterError(4, { from: o, to: n }))
            : y instanceof Error
              ? u(y)
              : isRouteLocation(y)
                ? u(createRouterError(2, { from: n, to: y }))
                : (a && s.enterCallbacks[r] === a && typeof y == 'function' && a.push(y), c())
        },
        d = i(() => t.call(s && s.instances[r], n, o, g))
      let v = Promise.resolve(d)
      t.length < 3 && (v = v.then(g)), v.catch((y) => u(y))
    })
}
function extractComponentsGuards(t, n, o, s, r = (i) => i()) {
  const i = []
  for (const a of t)
    for (const c in a.components) {
      let u = a.components[c]
      if (!(n !== 'beforeRouteEnter' && !a.instances[c]))
        if (isRouteComponent(u)) {
          const d = (u.__vccOpts || u)[n]
          d && i.push(guardToPromiseFn(d, o, s, a, c, r))
        } else {
          let g = u()
          i.push(() =>
            g.then((d) => {
              if (!d) throw new Error(`Couldn't resolve component "${c}" at "${a.path}"`)
              const v = isESModule(d) ? d.default : d
              ;(a.mods[c] = d), (a.components[c] = v)
              const _ = (v.__vccOpts || v)[n]
              return _ && guardToPromiseFn(_, o, s, a, c, r)()
            }),
          )
        }
    }
  return i
}
function useLink(t) {
  const n = inject(routerKey),
    o = inject(routeLocationKey),
    s = computed(() => {
      const u = unref(t.to)
      return n.resolve(u)
    }),
    r = computed(() => {
      const { matched: u } = s.value,
        { length: g } = u,
        d = u[g - 1],
        v = o.matched
      if (!d || !v.length) return -1
      const y = v.findIndex(isSameRouteRecord.bind(null, d))
      if (y > -1) return y
      const _ = getOriginalPath(u[g - 2])
      return g > 1 && getOriginalPath(d) === _ && v[v.length - 1].path !== _
        ? v.findIndex(isSameRouteRecord.bind(null, u[g - 2]))
        : y
    }),
    i = computed(() => r.value > -1 && includesParams(o.params, s.value.params)),
    a = computed(
      () =>
        r.value > -1 &&
        r.value === o.matched.length - 1 &&
        isSameRouteLocationParams(o.params, s.value.params),
    )
  function c(u = {}) {
    if (guardEvent(u)) {
      const g = n[unref(t.replace) ? 'replace' : 'push'](unref(t.to)).catch(noop)
      return (
        t.viewTransition &&
          typeof document < 'u' &&
          'startViewTransition' in document &&
          document.startViewTransition(() => g),
        g
      )
    }
    return Promise.resolve()
  }
  return {
    route: s,
    href: computed(() => s.value.href),
    isActive: i,
    isExactActive: a,
    navigate: c,
  }
}
function preferSingleVNode(t) {
  return t.length === 1 ? t[0] : t
}
const RouterLinkImpl = defineComponent({
    name: 'RouterLink',
    compatConfig: { MODE: 3 },
    props: {
      to: { type: [String, Object], required: !0 },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: { type: String, default: 'page' },
      viewTransition: Boolean,
    },
    useLink,
    setup(t, { slots: n }) {
      const o = reactive(useLink(t)),
        { options: s } = inject(routerKey),
        r = computed(() => ({
          [getLinkClass(t.activeClass, s.linkActiveClass, 'router-link-active')]: o.isActive,
          [getLinkClass(t.exactActiveClass, s.linkExactActiveClass, 'router-link-exact-active')]:
            o.isExactActive,
        }))
      return () => {
        const i = n.default && preferSingleVNode(n.default(o))
        return t.custom
          ? i
          : h$1(
              'a',
              {
                'aria-current': o.isExactActive ? t.ariaCurrentValue : null,
                href: o.href,
                onClick: o.navigate,
                class: r.value,
              },
              i,
            )
      }
    },
  }),
  RouterLink = RouterLinkImpl
function guardEvent(t) {
  if (
    !(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey) &&
    !t.defaultPrevented &&
    !(t.button !== void 0 && t.button !== 0)
  ) {
    if (t.currentTarget && t.currentTarget.getAttribute) {
      const n = t.currentTarget.getAttribute('target')
      if (/\b_blank\b/i.test(n)) return
    }
    return t.preventDefault && t.preventDefault(), !0
  }
}
function includesParams(t, n) {
  for (const o in n) {
    const s = n[o],
      r = t[o]
    if (typeof s == 'string') {
      if (s !== r) return !1
    } else if (!isArray(r) || r.length !== s.length || s.some((i, a) => i !== r[a])) return !1
  }
  return !0
}
function getOriginalPath(t) {
  return t ? (t.aliasOf ? t.aliasOf.path : t.path) : ''
}
const getLinkClass = (t, n, o) => t ?? n ?? o,
  RouterViewImpl = defineComponent({
    name: 'RouterView',
    inheritAttrs: !1,
    props: { name: { type: String, default: 'default' }, route: Object },
    compatConfig: { MODE: 3 },
    setup(t, { attrs: n, slots: o }) {
      const s = inject(routerViewLocationKey),
        r = computed(() => t.route || s.value),
        i = inject(viewDepthKey, 0),
        a = computed(() => {
          let g = unref(i)
          const { matched: d } = r.value
          let v
          for (; (v = d[g]) && !v.components; ) g++
          return g
        }),
        c = computed(() => r.value.matched[a.value])
      provide(
        viewDepthKey,
        computed(() => a.value + 1),
      ),
        provide(matchedRouteKey, c),
        provide(routerViewLocationKey, r)
      const u = ref()
      return (
        watch(
          () => [u.value, c.value, t.name],
          ([g, d, v], [y, _, $]) => {
            d &&
              ((d.instances[v] = g),
              _ &&
                _ !== d &&
                g &&
                g === y &&
                (d.leaveGuards.size || (d.leaveGuards = _.leaveGuards),
                d.updateGuards.size || (d.updateGuards = _.updateGuards))),
              g &&
                d &&
                (!_ || !isSameRouteRecord(d, _) || !y) &&
                (d.enterCallbacks[v] || []).forEach((A) => A(g))
          },
          { flush: 'post' },
        ),
        () => {
          const g = r.value,
            d = t.name,
            v = c.value,
            y = v && v.components[d]
          if (!y) return normalizeSlot(o.default, { Component: y, route: g })
          const _ = v.props[d],
            $ = _ ? (_ === !0 ? g.params : typeof _ == 'function' ? _(g) : _) : null,
            k = h$1(
              y,
              assign({}, $, n, {
                onVnodeUnmounted: (O) => {
                  O.component.isUnmounted && (v.instances[d] = null)
                },
                ref: u,
              }),
            )
          return normalizeSlot(o.default, { Component: k, route: g }) || k
        }
      )
    },
  })
function normalizeSlot(t, n) {
  if (!t) return null
  const o = t(n)
  return o.length === 1 ? o[0] : o
}
const RouterView = RouterViewImpl
function createRouter(t) {
  const n = createRouterMatcher(t.routes, t),
    o = t.parseQuery || parseQuery,
    s = t.stringifyQuery || stringifyQuery,
    r = t.history,
    i = useCallbacks(),
    a = useCallbacks(),
    c = useCallbacks(),
    u = shallowRef(START_LOCATION_NORMALIZED)
  let g = START_LOCATION_NORMALIZED
  isBrowser &&
    t.scrollBehavior &&
    'scrollRestoration' in history &&
    (history.scrollRestoration = 'manual')
  const d = applyToParams.bind(null, (z) => '' + z),
    v = applyToParams.bind(null, encodeParam),
    y = applyToParams.bind(null, decode)
  function _(z, Re) {
    let ke, Ee
    return isRouteName(z) ? ((ke = n.getRecordMatcher(z)), (Ee = Re)) : (Ee = z), n.addRoute(Ee, ke)
  }
  function $(z) {
    const Re = n.getRecordMatcher(z)
    Re && n.removeRoute(Re)
  }
  function A() {
    return n.getRoutes().map((z) => z.record)
  }
  function k(z) {
    return !!n.getRecordMatcher(z)
  }
  function O(z, Re) {
    if (((Re = assign({}, Re || u.value)), typeof z == 'string')) {
      const w = parseURL(o, z, Re.path),
        Ve = n.resolve({ path: w.path }, Re),
        $e = r.createHref(w.fullPath)
      return assign(w, Ve, {
        params: y(Ve.params),
        hash: decode(w.hash),
        redirectedFrom: void 0,
        href: $e,
      })
    }
    let ke
    if (z.path != null) ke = assign({}, z, { path: parseURL(o, z.path, Re.path).path })
    else {
      const w = assign({}, z.params)
      for (const Ve in w) w[Ve] == null && delete w[Ve]
      ;(ke = assign({}, z, { params: v(w) })), (Re.params = v(Re.params))
    }
    const Ee = n.resolve(ke, Re),
      Ye = z.hash || ''
    Ee.params = d(y(Ee.params))
    const Ge = stringifyURL(s, assign({}, z, { hash: encodeHash(Ye), path: Ee.path })),
      b = r.createHref(Ge)
    return assign(
      {
        fullPath: Ge,
        hash: Ye,
        query: s === stringifyQuery ? normalizeQuery(z.query) : z.query || {},
      },
      Ee,
      { redirectedFrom: void 0, href: b },
    )
  }
  function j(z) {
    return typeof z == 'string' ? parseURL(o, z, u.value.path) : assign({}, z)
  }
  function B(z, Re) {
    if (g !== z) return createRouterError(8, { from: Re, to: z })
  }
  function P(z) {
    return Se(z)
  }
  function F(z) {
    return P(assign(j(z), { replace: !0 }))
  }
  function Be(z) {
    const Re = z.matched[z.matched.length - 1]
    if (Re && Re.redirect) {
      const { redirect: ke } = Re
      let Ee = typeof ke == 'function' ? ke(z) : ke
      return (
        typeof Ee == 'string' &&
          ((Ee = Ee.includes('?') || Ee.includes('#') ? (Ee = j(Ee)) : { path: Ee }),
          (Ee.params = {})),
        assign({ query: z.query, hash: z.hash, params: Ee.path != null ? {} : z.params }, Ee)
      )
    }
  }
  function Se(z, Re) {
    const ke = (g = O(z)),
      Ee = u.value,
      Ye = z.state,
      Ge = z.force,
      b = z.replace === !0,
      w = Be(ke)
    if (w)
      return Se(
        assign(j(w), {
          state: typeof w == 'object' ? assign({}, Ye, w.state) : Ye,
          force: Ge,
          replace: b,
        }),
        Re || ke,
      )
    const Ve = ke
    Ve.redirectedFrom = Re
    let $e
    return (
      !Ge &&
        isSameRouteLocation(s, Ee, ke) &&
        (($e = createRouterError(16, { to: Ve, from: Ee })), ct(Ee, Ee, !0, !1)),
      ($e ? Promise.resolve($e) : D(Ve, Ee))
        .catch((Ne) =>
          isNavigationFailure(Ne) ? (isNavigationFailure(Ne, 2) ? Ne : it(Ne)) : Ke(Ne, Ve, Ee),
        )
        .then((Ne) => {
          if (Ne) {
            if (isNavigationFailure(Ne, 2))
              return Se(
                assign({ replace: b }, j(Ne.to), {
                  state: typeof Ne.to == 'object' ? assign({}, Ye, Ne.to.state) : Ye,
                  force: Ge,
                }),
                Re || Ve,
              )
          } else Ne = K(Ve, Ee, !0, b, Ye)
          return Te(Ve, Ee, Ne), Ne
        })
    )
  }
  function L(z, Re) {
    const ke = B(z, Re)
    return ke ? Promise.reject(ke) : Promise.resolve()
  }
  function R(z) {
    const Re = Ue.values().next().value
    return Re && typeof Re.runWithContext == 'function' ? Re.runWithContext(z) : z()
  }
  function D(z, Re) {
    let ke
    const [Ee, Ye, Ge] = extractChangingRecords(z, Re)
    ke = extractComponentsGuards(Ee.reverse(), 'beforeRouteLeave', z, Re)
    for (const w of Ee)
      w.leaveGuards.forEach((Ve) => {
        ke.push(guardToPromiseFn(Ve, z, Re))
      })
    const b = L.bind(null, z, Re)
    return (
      ke.push(b),
      We(ke)
        .then(() => {
          ke = []
          for (const w of i.list()) ke.push(guardToPromiseFn(w, z, Re))
          return ke.push(b), We(ke)
        })
        .then(() => {
          ke = extractComponentsGuards(Ye, 'beforeRouteUpdate', z, Re)
          for (const w of Ye)
            w.updateGuards.forEach((Ve) => {
              ke.push(guardToPromiseFn(Ve, z, Re))
            })
          return ke.push(b), We(ke)
        })
        .then(() => {
          ke = []
          for (const w of Ge)
            if (w.beforeEnter)
              if (isArray(w.beforeEnter))
                for (const Ve of w.beforeEnter) ke.push(guardToPromiseFn(Ve, z, Re))
              else ke.push(guardToPromiseFn(w.beforeEnter, z, Re))
          return ke.push(b), We(ke)
        })
        .then(
          () => (
            z.matched.forEach((w) => (w.enterCallbacks = {})),
            (ke = extractComponentsGuards(Ge, 'beforeRouteEnter', z, Re, R)),
            ke.push(b),
            We(ke)
          ),
        )
        .then(() => {
          ke = []
          for (const w of a.list()) ke.push(guardToPromiseFn(w, z, Re))
          return ke.push(b), We(ke)
        })
        .catch((w) => (isNavigationFailure(w, 8) ? w : Promise.reject(w)))
    )
  }
  function Te(z, Re, ke) {
    c.list().forEach((Ee) => R(() => Ee(z, Re, ke)))
  }
  function K(z, Re, ke, Ee, Ye) {
    const Ge = B(z, Re)
    if (Ge) return Ge
    const b = Re === START_LOCATION_NORMALIZED,
      w = isBrowser ? history.state : {}
    ke &&
      (Ee || b
        ? r.replace(z.fullPath, assign({ scroll: b && w && w.scroll }, Ye))
        : r.push(z.fullPath, Ye)),
      (u.value = z),
      ct(z, Re, ke, b),
      it()
  }
  let De
  function je() {
    De ||
      (De = r.listen((z, Re, ke) => {
        if (!Ae.listening) return
        const Ee = O(z),
          Ye = Be(Ee)
        if (Ye) {
          Se(assign(Ye, { replace: !0, force: !0 }), Ee).catch(noop)
          return
        }
        g = Ee
        const Ge = u.value
        isBrowser &&
          saveScrollPosition(getScrollKey(Ge.fullPath, ke.delta), computeScrollPosition()),
          D(Ee, Ge)
            .catch((b) =>
              isNavigationFailure(b, 12)
                ? b
                : isNavigationFailure(b, 2)
                  ? (Se(assign(j(b.to), { force: !0 }), Ee)
                      .then((w) => {
                        isNavigationFailure(w, 20) &&
                          !ke.delta &&
                          ke.type === NavigationType.pop &&
                          r.go(-1, !1)
                      })
                      .catch(noop),
                    Promise.reject())
                  : (ke.delta && r.go(-ke.delta, !1), Ke(b, Ee, Ge)),
            )
            .then((b) => {
              ;(b = b || K(Ee, Ge, !1)),
                b &&
                  (ke.delta && !isNavigationFailure(b, 8)
                    ? r.go(-ke.delta, !1)
                    : ke.type === NavigationType.pop && isNavigationFailure(b, 20) && r.go(-1, !1)),
                Te(Ee, Ge, b)
            })
            .catch(noop)
      }))
  }
  let Pe = useCallbacks(),
    xe = useCallbacks(),
    Ze
  function Ke(z, Re, ke) {
    it(z)
    const Ee = xe.list()
    return Ee.length ? Ee.forEach((Ye) => Ye(z, Re, ke)) : console.error(z), Promise.reject(z)
  }
  function rt() {
    return Ze && u.value !== START_LOCATION_NORMALIZED
      ? Promise.resolve()
      : new Promise((z, Re) => {
          Pe.add([z, Re])
        })
  }
  function it(z) {
    return (
      Ze || ((Ze = !z), je(), Pe.list().forEach(([Re, ke]) => (z ? ke(z) : Re())), Pe.reset()), z
    )
  }
  function ct(z, Re, ke, Ee) {
    const { scrollBehavior: Ye } = t
    if (!isBrowser || !Ye) return Promise.resolve()
    const Ge =
      (!ke && getSavedScrollPosition(getScrollKey(z.fullPath, 0))) ||
      ((Ee || !ke) && history.state && history.state.scroll) ||
      null
    return nextTick()
      .then(() => Ye(z, Re, Ge))
      .then((b) => b && scrollToPosition(b))
      .catch((b) => Ke(b, z, Re))
  }
  const ut = (z) => r.go(z)
  let ht
  const Ue = new Set(),
    Ae = {
      currentRoute: u,
      listening: !0,
      addRoute: _,
      removeRoute: $,
      clearRoutes: n.clearRoutes,
      hasRoute: k,
      getRoutes: A,
      resolve: O,
      options: t,
      push: P,
      replace: F,
      go: ut,
      back: () => ut(-1),
      forward: () => ut(1),
      beforeEach: i.add,
      beforeResolve: a.add,
      afterEach: c.add,
      onError: xe.add,
      isReady: rt,
      install(z) {
        const Re = this
        z.component('RouterLink', RouterLink),
          z.component('RouterView', RouterView),
          (z.config.globalProperties.$router = Re),
          Object.defineProperty(z.config.globalProperties, '$route', {
            enumerable: !0,
            get: () => unref(u),
          }),
          isBrowser &&
            !ht &&
            u.value === START_LOCATION_NORMALIZED &&
            ((ht = !0), P(r.location).catch((Ye) => {}))
        const ke = {}
        for (const Ye in START_LOCATION_NORMALIZED)
          Object.defineProperty(ke, Ye, { get: () => u.value[Ye], enumerable: !0 })
        z.provide(routerKey, Re),
          z.provide(routeLocationKey, shallowReactive(ke)),
          z.provide(routerViewLocationKey, u)
        const Ee = z.unmount
        Ue.add(z),
          (z.unmount = function () {
            Ue.delete(z),
              Ue.size < 1 &&
                ((g = START_LOCATION_NORMALIZED),
                De && De(),
                (De = null),
                (u.value = START_LOCATION_NORMALIZED),
                (ht = !1),
                (Ze = !1)),
              Ee()
          })
      },
    }
  function We(z) {
    return z.reduce((Re, ke) => Re.then(() => R(ke)), Promise.resolve())
  }
  return Ae
}
function extractChangingRecords(t, n) {
  const o = [],
    s = [],
    r = [],
    i = Math.max(n.matched.length, t.matched.length)
  for (let a = 0; a < i; a++) {
    const c = n.matched[a]
    c && (t.matched.find((g) => isSameRouteRecord(g, c)) ? s.push(c) : o.push(c))
    const u = t.matched[a]
    u && (n.matched.find((g) => isSameRouteRecord(g, u)) || r.push(u))
  }
  return [o, s, r]
}
function useRouter() {
  return inject(routerKey)
}
function useRoute(t) {
  return inject(routeLocationKey)
}
const useUserStore = defineStore('user', {
    state: () => ({ user: null }),
    actions: {
      async fetchMe() {
        const t = localStorage.getItem('token')
        if (t)
          try {
            const o = await (
              await fetch('https://api-abealcala.duckdns.org/me', {
                headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
              })
            ).json()
            o.code === 200 && (this.user = o.user)
          } catch (n) {
            console.error('Failed to fetch user:', n)
          }
      },
      clearUser() {
        this.user = null
      },
    },
  }),
  _hoisted_1$r = { key: 0 },
  _hoisted_2$o = { key: 1, class: 'layout' },
  _hoisted_3$k = { class: 'sidebar' },
  _hoisted_4$f = { class: 'sidebar-top' },
  _hoisted_5$c = { class: 'logo-title' },
  _hoisted_6$b = { class: 'header-text' },
  _hoisted_7$9 = { key: 0, class: 'user-info' },
  _hoisted_8$9 = { class: 'user-name' },
  _hoisted_9$9 = { class: 'nav' },
  _hoisted_10$6 = { class: 'logout-section' },
  _hoisted_11$6 = { class: 'main-content' },
  _sfc_main$r = {
    __name: 'App',
    setup(t) {
      const n = useUserStore(),
        o = useRouter(),
        s = useRoute(),
        r = ref(null)
      onMounted(async () => {
        const a = localStorage.getItem('token')
        if (!a) return
        const u = await (
          await fetch('https://api-abealcala.duckdns.org/me', {
            headers: { Authorization: `Bearer ${a}`, 'Content-Type': 'application/json' },
          })
        ).json()
        u.code === 200 && (r.value = u.user)
      })
      function i() {
        localStorage.removeItem('token'), n.clearUser(), o.push('/login')
      }
      return (a, c) =>
        unref(s).path === '/login'
          ? (openBlock(), createElementBlock('div', _hoisted_1$r, [createVNode(unref(RouterView))]))
          : (openBlock(),
            createElementBlock('div', _hoisted_2$o, [
              createBaseVNode('aside', _hoisted_3$k, [
                createBaseVNode('div', _hoisted_4$f, [
                  createBaseVNode('div', _hoisted_5$c, [
                    c[3] ||
                      (c[3] = createBaseVNode(
                        'div',
                        { class: 'logo-icon' },
                        [
                          createBaseVNode('img', {
                            src: _imports_0$1,
                            alt: 'ABE Logo',
                            width: '45',
                            height: '45',
                          }),
                        ],
                        -1,
                      )),
                    createBaseVNode('div', _hoisted_6$b, [
                      c[2] ||
                        (c[2] = createBaseVNode(
                          'div',
                          { class: 'project-name' },
                          'ABE Alcala MIS',
                          -1,
                        )),
                      unref(n).user
                        ? (openBlock(),
                          createElementBlock('div', _hoisted_7$9, [
                            createBaseVNode(
                              'span',
                              _hoisted_8$9,
                              toDisplayString(unref(n).user.username),
                              1,
                            ),
                          ]))
                        : createCommentVNode('', !0),
                    ]),
                  ]),
                  createBaseVNode('nav', _hoisted_9$9, [
                    createBaseVNode(
                      'div',
                      { class: normalizeClass(['nav-item', { active: unref(s).path === '/' }]) },
                      [
                        createVNode(
                          unref(RouterLink),
                          { to: '/', class: 'nav-link' },
                          {
                            default: withCtx(() => [
                              createVNode(unref(Home20), { class: 'icon' }),
                              c[4] || (c[4] = createBaseVNode('span', null, 'Dashboard', -1)),
                            ]),
                            _: 1,
                            __: [4],
                          },
                        ),
                      ],
                      2,
                    ),
                    createBaseVNode(
                      'div',
                      {
                        class: normalizeClass([
                          'nav-item',
                          { active: unref(s).path.startsWith('/fca') },
                        ]),
                      },
                      [
                        createVNode(
                          unref(RouterLink),
                          { to: '/fcas', class: 'nav-link' },
                          {
                            default: withCtx(() => [
                              createVNode(unref(UserProfile20), { class: 'icon' }),
                              c[5] || (c[5] = createBaseVNode('span', null, 'FCA Profiles', -1)),
                            ]),
                            _: 1,
                            __: [5],
                          },
                        ),
                        createVNode(unref(Add20), {
                          class: 'plus-icon',
                          onClick: c[0] || (c[0] = (u) => unref(o).push('/fca')),
                        }),
                      ],
                      2,
                    ),
                    createBaseVNode(
                      'div',
                      {
                        class: normalizeClass([
                          'nav-item',
                          { active: unref(s).path === '/documents' },
                        ]),
                      },
                      [
                        createVNode(
                          unref(RouterLink),
                          { to: '/documents', class: 'nav-link' },
                          {
                            default: withCtx(() => [
                              createVNode(unref(Document20), { class: 'icon' }),
                              c[6] || (c[6] = createBaseVNode('span', null, 'Documents', -1)),
                            ]),
                            _: 1,
                            __: [6],
                          },
                        ),
                        createVNode(unref(Add20), {
                          class: 'plus-icon',
                          onClick: c[1] || (c[1] = (u) => unref(o).push('/generate')),
                        }),
                      ],
                      2,
                    ),
                    createBaseVNode(
                      'div',
                      {
                        class: normalizeClass([
                          'nav-item',
                          { active: unref(s).path.startsWith('/settings') },
                        ]),
                      },
                      [
                        createVNode(
                          unref(RouterLink),
                          { to: '/settings', class: 'nav-link' },
                          {
                            default: withCtx(() => [
                              createVNode(unref(Settings20), { class: 'icon' }),
                              c[7] || (c[7] = createBaseVNode('span', null, 'Settings', -1)),
                            ]),
                            _: 1,
                            __: [7],
                          },
                        ),
                      ],
                      2,
                    ),
                  ]),
                ]),
                createBaseVNode('div', _hoisted_10$6, [
                  createBaseVNode('button', { class: 'logout-btn', onClick: i }, [
                    createVNode(unref(Logout20), { class: 'icon' }),
                    c[8] || (c[8] = createBaseVNode('span', null, 'Logout', -1)),
                  ]),
                ]),
              ]),
              createBaseVNode('main', _hoisted_11$6, [createVNode(unref(RouterView))]),
            ]))
    },
  },
  App = _export_sfc(_sfc_main$r, [['__scopeId', 'data-v-51f8cdaa']]),
  scriptRel = 'modulepreload',
  assetsURL = function (t) {
    return '/' + t
  },
  seen = {},
  __vitePreload = function (n, o, s) {
    let r = Promise.resolve()
    if (o && o.length > 0) {
      let u = function (g) {
        return Promise.all(
          g.map((d) =>
            Promise.resolve(d).then(
              (v) => ({ status: 'fulfilled', value: v }),
              (v) => ({ status: 'rejected', reason: v }),
            ),
          ),
        )
      }
      document.getElementsByTagName('link')
      const a = document.querySelector('meta[property=csp-nonce]'),
        c = a?.nonce || a?.getAttribute('nonce')
      r = u(
        o.map((g) => {
          if (((g = assetsURL(g)), g in seen)) return
          seen[g] = !0
          const d = g.endsWith('.css'),
            v = d ? '[rel="stylesheet"]' : ''
          if (document.querySelector(`link[href="${g}"]${v}`)) return
          const y = document.createElement('link')
          if (
            ((y.rel = d ? 'stylesheet' : scriptRel),
            d || (y.as = 'script'),
            (y.crossOrigin = ''),
            (y.href = g),
            c && y.setAttribute('nonce', c),
            document.head.appendChild(y),
            d)
          )
            return new Promise((_, $) => {
              y.addEventListener('load', _),
                y.addEventListener('error', () => $(new Error(`Unable to preload CSS for ${g}`)))
            })
        }),
      )
    }
    function i(a) {
      const c = new Event('vite:preloadError', { cancelable: !0 })
      if (((c.payload = a), window.dispatchEvent(c), !c.defaultPrevented)) throw a
    }
    return r.then((a) => {
      for (const c of a || []) c.status === 'rejected' && i(c.reason)
      return n().catch(i)
    })
  },
  _hoisted_1$q = { class: 'input-field' },
  _hoisted_2$n = { class: 'field-label' },
  _hoisted_3$j = ['type', 'disabled', 'required'],
  _sfc_main$q = {
    __name: 'InputField',
    props: mergeModels(['field', 'modelValue'], { modelValue: {}, modelModifiers: {} }),
    emits: mergeModels(['update:modelValue'], ['update:modelValue']),
    setup(t, { emit: n }) {
      const o = useModel(t, 'modelValue')
      return (s, r) => (
        openBlock(),
        createElementBlock('div', _hoisted_1$q, [
          createBaseVNode('label', _hoisted_2$n, toDisplayString(t.field.field_label), 1),
          withDirectives(
            createBaseVNode(
              'input',
              {
                type: t.field.field_type === 'number' ? 'number' : 'text',
                disabled: t.field.properties.disabled,
                required: t.field.properties.required,
                'onUpdate:modelValue': r[0] || (r[0] = (i) => (o.value = i)),
                class: 'input-control',
              },
              null,
              8,
              _hoisted_3$j,
            ),
            [[vModelDynamic, o.value]],
          ),
        ])
      )
    },
  },
  InputField = _export_sfc(_sfc_main$q, [['__scopeId', 'data-v-6c93ea95']]),
  _hoisted_1$p = { class: 'date-field' },
  _hoisted_2$m = { class: 'field-label' },
  _hoisted_3$i = ['value'],
  _sfc_main$p = {
    __name: 'DateField',
    props: ['field', 'modelValue'],
    emits: ['update:modelValue'],
    setup(t, { emit: n }) {
      const o = t,
        s = n,
        r = computed(() => {
          if (!o.modelValue?.year || !o.modelValue?.month || !o.modelValue?.day) return ''
          const c = o.modelValue.year,
            u = String(o.modelValue.month).padStart(2, '0'),
            g = String(o.modelValue.day).padStart(2, '0')
          return `${c}-${u}-${g}`
        }),
        i = (c) => {
          const u = new Date(c.target.value)
          if (isNaN(u)) return
          const g = u.getMonth() + 1,
            d = u.getDate(),
            v = u.getFullYear(),
            y = u.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            _ = u.toLocaleDateString('en-US'),
            $ = u.toLocaleDateString('en-US', { month: 'long' }),
            A = a(d)
          s('update:modelValue', {
            month: g,
            day: d,
            year: v,
            full: y,
            short: _,
            cardinal_day: A,
            month_word: $,
          })
        }
      function a(c) {
        const u = ['th', 'st', 'nd', 'rd'],
          g = c % 100
        return c + (u[(g - 20) % 10] || u[g] || u[0])
      }
      return (c, u) => (
        openBlock(),
        createElementBlock('div', _hoisted_1$p, [
          createBaseVNode('label', _hoisted_2$m, toDisplayString(t.field.field_label), 1),
          createBaseVNode(
            'input',
            { class: 'date-input', value: r.value, type: 'date', onInput: i },
            null,
            40,
            _hoisted_3$i,
          ),
        ])
      )
    },
  },
  DateField = _export_sfc(_sfc_main$p, [['__scopeId', 'data-v-f7f17d73']]),
  _hoisted_1$o = { class: 'input-field' },
  _hoisted_2$l = { class: 'field-label' },
  _hoisted_3$h = ['multiple', 'disabled'],
  _hoisted_4$e = ['value'],
  _sfc_main$o = {
    __name: 'DropdownField',
    props: mergeModels(['field', 'modelValue'], { modelValue: {}, modelModifiers: {} }),
    emits: mergeModels(['update:modelValue'], ['update:modelValue']),
    setup(t, { emit: n }) {
      const o = useModel(t, 'modelValue')
      return (s, r) => (
        openBlock(),
        createElementBlock('div', _hoisted_1$o, [
          createBaseVNode('label', _hoisted_2$l, toDisplayString(t.field.field_label), 1),
          withDirectives(
            createBaseVNode(
              'select',
              {
                multiple: t.field.properties.multiple,
                disabled: t.field.properties.disabled,
                'onUpdate:modelValue': r[0] || (r[0] = (i) => (o.value = i)),
                class: 'select-control',
              },
              [
                (openBlock(!0),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(
                    t.field.properties.options,
                    (i) => (
                      openBlock(),
                      createElementBlock(
                        'option',
                        { key: i, value: i },
                        toDisplayString(i),
                        9,
                        _hoisted_4$e,
                      )
                    ),
                  ),
                  128,
                )),
              ],
              8,
              _hoisted_3$h,
            ),
            [[vModelSelect, o.value]],
          ),
        ])
      )
    },
  },
  DropdownField = _export_sfc(_sfc_main$o, [['__scopeId', 'data-v-e2c18f31']]),
  _hoisted_1$n = ['name', 'value'],
  _sfc_main$n = {
    __name: 'RadioField',
    props: mergeModels(['field', 'modelValue'], { modelValue: {}, modelModifiers: {} }),
    emits: mergeModels(['update:modelValue'], ['update:modelValue']),
    setup(t, { emit: n }) {
      const o = useModel(t, 'modelValue')
      return (s, r) => (
        openBlock(),
        createElementBlock('div', null, [
          createBaseVNode('label', null, toDisplayString(t.field.field_label), 1),
          (openBlock(!0),
          createElementBlock(
            Fragment,
            null,
            renderList(
              t.field.properties.options,
              (i) => (
                openBlock(),
                createElementBlock('div', { key: i }, [
                  createBaseVNode('label', null, [
                    withDirectives(
                      createBaseVNode(
                        'input',
                        {
                          type: 'radio',
                          name: t.field.field_label,
                          value: i,
                          'onUpdate:modelValue': r[0] || (r[0] = (a) => (o.value = a)),
                        },
                        null,
                        8,
                        _hoisted_1$n,
                      ),
                      [[vModelRadio, o.value]],
                    ),
                    createTextVNode(' ' + toDisplayString(i), 1),
                  ]),
                ])
              ),
            ),
            128,
          )),
        ])
      )
    },
  },
  _hoisted_1$m = ['value', 'disabled', 'checked', 'onChange'],
  _sfc_main$m = {
    __name: 'CheckboxField',
    props: mergeModels(['field', 'modelValue'], { modelValue: {}, modelModifiers: {} }),
    emits: mergeModels(['update:modelValue'], ['update:modelValue']),
    setup(t, { emit: n }) {
      const o = n,
        s = useModel(t, 'modelValue')
      function r(i) {
        const a = [...s],
          c = a.indexOf(i)
        c > -1 ? a.splice(c, 1) : a.push(i), o('update:modelValue', a)
      }
      return (i, a) => (
        openBlock(),
        createElementBlock('div', null, [
          createBaseVNode('label', null, toDisplayString(t.field.field_label), 1),
          (openBlock(!0),
          createElementBlock(
            Fragment,
            null,
            renderList(
              t.field.properties.options,
              (c) => (
                openBlock(),
                createElementBlock('div', { key: c }, [
                  createBaseVNode('label', null, [
                    createBaseVNode(
                      'input',
                      {
                        type: 'checkbox',
                        value: c,
                        disabled: t.field.properties.disabled,
                        checked: s.value.includes(c),
                        onChange: (u) => r(c),
                      },
                      null,
                      40,
                      _hoisted_1$m,
                    ),
                    createTextVNode(' ' + toDisplayString(c), 1),
                  ]),
                ])
              ),
            ),
            128,
          )),
        ])
      )
    },
  },
  _hoisted_1$l = { border: '1', cellpadding: '4' },
  _sfc_main$l = {
    __name: 'TableField',
    props: ['field', 'modelValue'],
    emits: ['update:modelValue'],
    setup(t, { emit: n }) {
      const o = t,
        s = n,
        r = (c) =>
          c
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .split(' ')
            .map((u) => u.charAt(0).toUpperCase() + u.slice(1))
            .join('')
      function i(c) {
        switch (c.field_type) {
          case 'text':
          case 'number':
          case 'money':
            return InputField
          case 'date':
            return DateField
          case 'dropdown':
            return DropdownField
          case 'radio':
            return _sfc_main$n
          case 'checkbox':
            return _sfc_main$m
          default:
            return 'div'
        }
      }
      function a() {
        const c = Object.fromEntries(
          o.field.properties.columns.map((u) => [
            r(u.field_label),
            ['checkbox', 'dropdown'].includes(u.field_type) && u.properties.multiple ? [] : '',
          ]),
        )
        s('update:modelValue', [...o.modelValue, c])
      }
      return (c, u) => (
        openBlock(),
        createElementBlock('div', null, [
          createBaseVNode('label', null, toDisplayString(t.field.field_label), 1),
          createBaseVNode('table', _hoisted_1$l, [
            createBaseVNode('thead', null, [
              createBaseVNode('tr', null, [
                (openBlock(!0),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(
                    t.field.properties.columns,
                    (g) => (
                      openBlock(),
                      createElementBlock(
                        'th',
                        { key: g.field_label },
                        toDisplayString(g.field_label),
                        1,
                      )
                    ),
                  ),
                  128,
                )),
              ]),
            ]),
            createBaseVNode('tbody', null, [
              (openBlock(!0),
              createElementBlock(
                Fragment,
                null,
                renderList(
                  t.modelValue,
                  (g, d) => (
                    openBlock(),
                    createElementBlock('tr', { key: d }, [
                      (openBlock(!0),
                      createElementBlock(
                        Fragment,
                        null,
                        renderList(
                          t.field.properties.columns,
                          (v) => (
                            openBlock(),
                            createElementBlock('td', { key: v.field_label }, [
                              (openBlock(),
                              createBlock(
                                resolveDynamicComponent(i(v)),
                                {
                                  field: v,
                                  modelValue: g[r(v.field_label)],
                                  'onUpdate:modelValue': (y) => (g[r(v.field_label)] = y),
                                },
                                null,
                                8,
                                ['field', 'modelValue', 'onUpdate:modelValue'],
                              )),
                            ])
                          ),
                        ),
                        128,
                      )),
                    ])
                  ),
                ),
                128,
              )),
            ]),
          ]),
          createBaseVNode('button', { onClick: a }, '+ Add Row'),
        ])
      )
    },
  },
  _hoisted_1$k = { key: 0, class: 'modal' },
  _hoisted_2$k = { class: 'modal-content' },
  _sfc_main$k = {
    __name: 'PreviewView',
    setup(t) {
      const n = ref(!1),
        o = (c) =>
          c
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .split(' ')
            .map((u) => u.charAt(0).toUpperCase() + u.slice(1))
            .join(''),
        s = [
          {
            field_type: 'text',
            field_label: 'Name',
            properties: { hidden: !1, disabled: !1, required: !0 },
          },
          {
            field_type: 'date',
            field_label: 'Date of Certification',
            properties: { hidden: !1, disabled: !1, required: !0 },
          },
          {
            field_type: 'dropdown',
            field_label: 'Commodity',
            properties: {
              hidden: !1,
              disabled: !1,
              required: !0,
              options: ['Rice', 'Corn', 'Peanuts'],
              multiple: !1,
            },
          },
          {
            field_type: 'radio',
            field_label: 'Gender',
            properties: { hidden: !1, disabled: !1, required: !0, options: ['Male', 'Female'] },
          },
          {
            field_type: 'table',
            field_label: 'People',
            properties: {
              hidden: !1,
              disabled: !1,
              min_rows: 1,
              columns: [
                {
                  field_type: 'text',
                  field_label: 'Name',
                  properties: { hidden: !1, disabled: !1, required: !0 },
                },
                {
                  field_type: 'number',
                  field_label: 'Since',
                  properties: { hidden: !1, disabled: !1, required: !0 },
                },
                {
                  field_type: 'dropdown',
                  field_label: 'Role',
                  properties: {
                    required: !1,
                    disabled: !1,
                    hidden: !1,
                    options: ['Leader', 'Member'],
                    multiple: !1,
                  },
                },
              ],
            },
          },
        ],
        r = reactive({})
      s.forEach((c) => {
        const u = o(c.field_label)
        if (c.field_type === 'date') r[u] = { month: '', day: '', year: '' }
        else if (['checkbox', 'dropdown'].includes(c.field_type) && c.properties.multiple) r[u] = []
        else if (c.field_type === 'table') {
          const g = c.properties.min_rows || 0,
            d = () =>
              Object.fromEntries(
                c.properties.columns.map((v) => [
                  o(v.field_label),
                  ['checkbox', 'dropdown'].includes(v.field_type) && v.properties.multiple
                    ? []
                    : '',
                ]),
              )
          r[u] = Array.from({ length: g }, d)
        } else r[u] = ''
      })
      function i(c) {
        switch (c.field_type) {
          case 'text':
          case 'number':
          case 'money':
            return InputField
          case 'date':
            return DateField
          case 'dropdown':
            return DropdownField
          case 'checkbox':
            return _sfc_main$m
          case 'radio':
            return _sfc_main$n
          case 'table':
            return _sfc_main$l
          default:
            return 'div'
        }
      }
      function a() {
        console.log(JSON.stringify(r, null, 2))
      }
      return (c, u) => (
        openBlock(),
        createElementBlock('div', null, [
          createBaseVNode(
            'button',
            { onClick: u[0] || (u[0] = (g) => (n.value = !0)) },
            'Preview Form',
          ),
          n.value
            ? (openBlock(),
              createElementBlock('div', _hoisted_1$k, [
                createBaseVNode('div', _hoisted_2$k, [
                  u[3] || (u[3] = createBaseVNode('h3', null, 'Dynamic Form', -1)),
                  createBaseVNode(
                    'form',
                    { onSubmit: withModifiers(a, ['prevent']) },
                    [
                      (openBlock(),
                      createElementBlock(
                        Fragment,
                        null,
                        renderList(s, (g, d) =>
                          createBaseVNode('div', { key: d, class: 'field-block' }, [
                            (openBlock(),
                            createBlock(
                              resolveDynamicComponent(i(g)),
                              {
                                field: g,
                                modelValue: r[o(g.field_label)],
                                'onUpdate:modelValue': (v) => (r[o(g.field_label)] = v),
                              },
                              null,
                              8,
                              ['field', 'modelValue', 'onUpdate:modelValue'],
                            )),
                          ]),
                        ),
                        64,
                      )),
                      u[2] || (u[2] = createBaseVNode('button', { type: 'submit' }, 'Submit', -1)),
                    ],
                    32,
                  ),
                  createBaseVNode(
                    'button',
                    { onClick: u[1] || (u[1] = (g) => (n.value = !1)) },
                    'Close',
                  ),
                ]),
                createBaseVNode('pre', null, toDisplayString(JSON.stringify(r, null, 2)), 1),
              ]))
            : createCommentVNode('', !0),
        ])
      )
    },
  },
  PreviewView = _export_sfc(_sfc_main$k, [['__scopeId', 'data-v-fe109c52']]),
  _hoisted_1$j = { class: 'date-input-field' },
  _hoisted_2$j = { class: 'field-label' },
  _hoisted_3$g = ['disabled', 'required'],
  _sfc_main$j = {
    __name: 'DateInputField',
    props: ['field', 'modelValue'],
    emits: ['update:modelValue'],
    setup(t, { emit: n }) {
      const o = t,
        s = n,
        r = (a) => {
          if (!a) return ''
          const c = new Date(a)
          return isNaN(c) ? '' : c.toISOString().slice(0, 10)
        },
        i = computed({
          get() {
            return r(o.modelValue)
          },
          set(a) {
            s('update:modelValue', a)
          },
        })
      return (
        onMounted(() => {
          const a = r(o.modelValue)
          a && a !== o.modelValue && s('update:modelValue', a)
        }),
        watch(
          () => o.modelValue,
          (a) => {
            const c = r(a)
            c && c !== a && s('update:modelValue', c)
          },
        ),
        (a, c) => (
          openBlock(),
          createElementBlock('div', _hoisted_1$j, [
            createBaseVNode('label', _hoisted_2$j, toDisplayString(t.field.field_label), 1),
            withDirectives(
              createBaseVNode(
                'input',
                {
                  type: 'date',
                  disabled: t.field.properties.disabled,
                  required: t.field.properties.required,
                  'onUpdate:modelValue': c[0] || (c[0] = (u) => (i.value = u)),
                  class: 'date-input',
                },
                null,
                8,
                _hoisted_3$g,
              ),
              [[vModelText, i.value]],
            ),
          ])
        )
      )
    },
  },
  DateInputField = _export_sfc(_sfc_main$j, [['__scopeId', 'data-v-cfd7c46f']]),
  _hoisted_1$i = { class: 'form-title' },
  _hoisted_2$i = { class: 'row' },
  _hoisted_3$f = { class: 'row' },
  _hoisted_4$d = { class: 'row' },
  _hoisted_5$b = { class: 'row' },
  _hoisted_6$a = { class: 'row' },
  _hoisted_7$8 = { class: 'row' },
  _hoisted_8$8 = { class: 'row' },
  _hoisted_9$8 = { class: 'row' },
  _hoisted_10$5 = { class: 'submit-section' },
  _hoisted_11$5 = { class: 'submit-btn', type: 'submit' },
  _sfc_main$i = {
    __name: 'FcaForm',
    props: { initialData: Object, editMode: Boolean },
    emits: ['updated', 'close'],
    setup(t, { emit: n }) {
      const o = t,
        s = n,
        r = localStorage.getItem('token'),
        i = reactive({
          general: {
            name: '',
            acronym: '',
            type: '',
            reg_no: '',
            year_registered: null,
            brgy: '',
            street: '',
            municipality: '',
            province: '',
            zip_code: '',
            major_commodity: '',
            total_members: null,
            business_operation: '',
          },
          organization: { landline: '', email: '', website: '' },
          officers: [{ name: '', position: '', civil_status: '', birth_date: '', mobile_no: '' }],
          bods: [{ name: '' }],
        })
      watch(
        () => o.initialData,
        (g) => {
          if (g) {
            const d = JSON.parse(JSON.stringify(g))
            Object.assign(i.general, d.general || {}),
              Object.assign(i.organization, d.organization || {}),
              i.officers.splice(
                0,
                i.officers.length,
                ...(d.officers && d.officers.length
                  ? d.officers
                  : [{ name: '', position: '', civil_status: '', birth_date: '', mobile_no: '' }]),
              ),
              i.bods.splice(
                0,
                i.bods.length,
                ...(d.bods && d.bods.length ? d.bods : [{ name: '' }]),
              )
          }
        },
        { immediate: !0, deep: !0 },
      )
      function a() {
        i.officers.push({ name: '', position: '', civil_status: '', birth_date: '', mobile_no: '' })
      }
      function c() {
        i.bods.push({ name: '' })
      }
      async function u() {
        try {
          let g = 'https://api-abealcala.duckdns.org/add_fca',
            d = 'POST'
          o.editMode &&
            o.initialData?.general?.id &&
            ((g = `https://api-abealcala.duckdns.org/update_fca/${o.initialData.general.id}`),
            (d = 'PUT'))
          const v = await fetch(g, {
              method: d,
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${r}` },
              body: JSON.stringify(toRaw(i)),
            }),
            y = await v.json()
          v.ok
            ? (alert(o.editMode ? 'FCA updated successfully' : 'Form submitted successfully'),
              s('updated'))
            : alert(y.message || 'Submission failed')
        } catch (g) {
          console.error('Error:', g), alert('Submission failed')
        }
      }
      return (g, d) => (
        openBlock(),
        createElementBlock(
          'form',
          { onSubmit: withModifiers(u, ['prevent']), class: 'fca-form' },
          [
            createBaseVNode(
              'h1',
              _hoisted_1$i,
              toDisplayString(t.editMode ? 'Edit FCA Profile' : 'New FCA Profile'),
              1,
            ),
            createBaseVNode('section', null, [
              d[16] ||
                (d[16] = createBaseVNode(
                  'h2',
                  { class: 'section-title' },
                  'General Information',
                  -1,
                )),
              createBaseVNode('div', _hoisted_2$i, [
                createVNode(
                  InputField,
                  {
                    modelValue: i.general.name,
                    'onUpdate:modelValue': d[0] || (d[0] = (v) => (i.general.name = v)),
                    field: { field_label: 'Name', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
                createVNode(
                  InputField,
                  {
                    modelValue: i.general.acronym,
                    'onUpdate:modelValue': d[1] || (d[1] = (v) => (i.general.acronym = v)),
                    field: { field_label: 'Acronym', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
              ]),
              createBaseVNode('div', _hoisted_3$f, [
                createVNode(
                  DropdownField,
                  {
                    modelValue: i.general.type,
                    'onUpdate:modelValue': d[2] || (d[2] = (v) => (i.general.type = v)),
                    field: {
                      field_label: 'Type',
                      properties: { options: ['Cooperative', 'Association'], multiple: !1 },
                    },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
                createVNode(
                  InputField,
                  {
                    modelValue: i.general.reg_no,
                    'onUpdate:modelValue': d[3] || (d[3] = (v) => (i.general.reg_no = v)),
                    field: { field_label: 'Reg No', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
                createVNode(
                  InputField,
                  {
                    modelValue: i.general.year_registered,
                    'onUpdate:modelValue': d[4] || (d[4] = (v) => (i.general.year_registered = v)),
                    field: { field_type: 'number', field_label: 'Year Registered', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
              ]),
              createBaseVNode('div', _hoisted_4$d, [
                createVNode(
                  InputField,
                  {
                    modelValue: i.general.brgy,
                    'onUpdate:modelValue': d[5] || (d[5] = (v) => (i.general.brgy = v)),
                    field: { field_label: 'Barangay', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
                createVNode(
                  InputField,
                  {
                    modelValue: i.general.street,
                    'onUpdate:modelValue': d[6] || (d[6] = (v) => (i.general.street = v)),
                    field: { field_label: 'Street', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
              ]),
              createBaseVNode('div', _hoisted_5$b, [
                createVNode(
                  InputField,
                  {
                    modelValue: i.general.municipality,
                    'onUpdate:modelValue': d[7] || (d[7] = (v) => (i.general.municipality = v)),
                    field: { field_label: 'Municipality', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
                createVNode(
                  InputField,
                  {
                    modelValue: i.general.province,
                    'onUpdate:modelValue': d[8] || (d[8] = (v) => (i.general.province = v)),
                    field: { field_label: 'Province', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
                createVNode(
                  InputField,
                  {
                    modelValue: i.general.zip_code,
                    'onUpdate:modelValue': d[9] || (d[9] = (v) => (i.general.zip_code = v)),
                    field: { field_label: 'Zip Code', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
              ]),
              createBaseVNode('div', _hoisted_6$a, [
                createVNode(
                  DropdownField,
                  {
                    modelValue: i.general.major_commodity,
                    'onUpdate:modelValue':
                      d[10] || (d[10] = (v) => (i.general.major_commodity = v)),
                    field: {
                      field_label: 'Major Commodity',
                      properties: { options: ['Rice', 'Corn', 'Peanuts'], multiple: !1 },
                    },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
                createVNode(
                  InputField,
                  {
                    modelValue: i.general.total_members,
                    'onUpdate:modelValue': d[11] || (d[11] = (v) => (i.general.total_members = v)),
                    field: { field_label: 'Total Members', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
              ]),
              createVNode(
                InputField,
                {
                  modelValue: i.general.business_operation,
                  'onUpdate:modelValue':
                    d[12] || (d[12] = (v) => (i.general.business_operation = v)),
                  field: { field_label: 'Business Operation', properties: {} },
                },
                null,
                8,
                ['modelValue'],
              ),
            ]),
            createBaseVNode('section', null, [
              d[17] ||
                (d[17] = createBaseVNode(
                  'h2',
                  { class: 'section-title' },
                  'Organization Contact',
                  -1,
                )),
              createBaseVNode('div', _hoisted_7$8, [
                createVNode(
                  InputField,
                  {
                    modelValue: i.organization.landline,
                    'onUpdate:modelValue': d[13] || (d[13] = (v) => (i.organization.landline = v)),
                    field: { field_label: 'Landline', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
                createVNode(
                  InputField,
                  {
                    modelValue: i.organization.email,
                    'onUpdate:modelValue': d[14] || (d[14] = (v) => (i.organization.email = v)),
                    field: { field_label: 'Email', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
                createVNode(
                  InputField,
                  {
                    modelValue: i.organization.website,
                    'onUpdate:modelValue': d[15] || (d[15] = (v) => (i.organization.website = v)),
                    field: { field_label: 'Website', properties: {} },
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
              ]),
            ]),
            createBaseVNode('section', null, [
              d[18] || (d[18] = createBaseVNode('h2', { class: 'section-title' }, 'Officers', -1)),
              (openBlock(!0),
              createElementBlock(
                Fragment,
                null,
                renderList(
                  i.officers,
                  (v, y) => (
                    openBlock(),
                    createElementBlock('div', { key: y, class: 'group-block' }, [
                      createBaseVNode('div', _hoisted_8$8, [
                        createVNode(
                          InputField,
                          {
                            modelValue: v.name,
                            'onUpdate:modelValue': (_) => (v.name = _),
                            field: { field_label: 'Name', properties: {} },
                          },
                          null,
                          8,
                          ['modelValue', 'onUpdate:modelValue'],
                        ),
                        createVNode(
                          DropdownField,
                          {
                            modelValue: v.position,
                            'onUpdate:modelValue': (_) => (v.position = _),
                            field: {
                              field_label: 'Position',
                              properties: {
                                options: ['Chairman', 'Treasurer', 'Secretary'],
                                multiple: !1,
                              },
                            },
                          },
                          null,
                          8,
                          ['modelValue', 'onUpdate:modelValue'],
                        ),
                        createVNode(
                          DropdownField,
                          {
                            modelValue: v.civil_status,
                            'onUpdate:modelValue': (_) => (v.civil_status = _),
                            field: {
                              field_label: 'Civil Status',
                              properties: {
                                options: ['Single', 'Married', 'Widowed'],
                                multiple: !1,
                              },
                            },
                          },
                          null,
                          8,
                          ['modelValue', 'onUpdate:modelValue'],
                        ),
                      ]),
                      createBaseVNode('div', _hoisted_9$8, [
                        createVNode(
                          DateInputField,
                          {
                            modelValue: v.birth_date,
                            'onUpdate:modelValue': (_) => (v.birth_date = _),
                            field: { field_label: 'Birth Date', properties: {} },
                          },
                          null,
                          8,
                          ['modelValue', 'onUpdate:modelValue'],
                        ),
                        createVNode(
                          InputField,
                          {
                            modelValue: v.mobile_no,
                            'onUpdate:modelValue': (_) => (v.mobile_no = _),
                            field: { field_label: 'Mobile No', properties: {} },
                          },
                          null,
                          8,
                          ['modelValue', 'onUpdate:modelValue'],
                        ),
                      ]),
                    ])
                  ),
                ),
                128,
              )),
              createBaseVNode(
                'button',
                { type: 'button', class: 'add-btn', onClick: a },
                '+ Add Officer',
              ),
            ]),
            createBaseVNode('section', null, [
              d[19] ||
                (d[19] = createBaseVNode(
                  'h2',
                  { class: 'section-title' },
                  'Board of Directors (BODs)',
                  -1,
                )),
              (openBlock(!0),
              createElementBlock(
                Fragment,
                null,
                renderList(
                  i.bods,
                  (v, y) => (
                    openBlock(),
                    createElementBlock('div', { key: y, class: 'group-block' }, [
                      createVNode(
                        InputField,
                        {
                          modelValue: v.name,
                          'onUpdate:modelValue': (_) => (v.name = _),
                          field: { field_label: 'Name', properties: {} },
                        },
                        null,
                        8,
                        ['modelValue', 'onUpdate:modelValue'],
                      ),
                    ])
                  ),
                ),
                128,
              )),
              createBaseVNode(
                'button',
                { type: 'button', class: 'add-btn', onClick: c },
                '+ Add BOD',
              ),
            ]),
            createBaseVNode('div', _hoisted_10$5, [
              createBaseVNode(
                'button',
                _hoisted_11$5,
                toDisplayString(t.editMode ? 'Update FCA' : 'Submit FCA'),
                1,
              ),
            ]),
          ],
          32,
        )
      )
    },
  },
  FcaForm = _export_sfc(_sfc_main$i, [['__scopeId', 'data-v-e0e3cd38']]),
  _imports_0 = '/assets/logo-CEfcPp9W.svg',
  _hoisted_1$h = { class: 'input-group' },
  _hoisted_2$h = ['value'],
  _sfc_main$h = {
    __name: 'UserNameField',
    props: { modelValue: String },
    emits: ['update:modelValue'],
    setup(t) {
      return (n, o) => (
        openBlock(),
        createElementBlock('div', _hoisted_1$h, [
          o[1] || (o[1] = createBaseVNode('label', null, 'Username', -1)),
          createBaseVNode(
            'input',
            {
              type: 'text',
              value: t.modelValue,
              onInput: o[0] || (o[0] = (s) => n.$emit('update:modelValue', s.target.value)),
              required: '',
            },
            null,
            40,
            _hoisted_2$h,
          ),
        ])
      )
    },
  },
  UserNameField = _export_sfc(_sfc_main$h, [['__scopeId', 'data-v-14206eb0']]),
  _hoisted_1$g = { class: 'input-group' },
  _hoisted_2$g = { class: 'password-wrapper' },
  _hoisted_3$e = ['type', 'value'],
  _sfc_main$g = {
    __name: 'PasswordField',
    props: { modelValue: String },
    emits: ['update:modelValue'],
    setup(t) {
      const n = ref(!1)
      return (o, s) => (
        openBlock(),
        createElementBlock('div', _hoisted_1$g, [
          s[3] || (s[3] = createBaseVNode('label', null, 'Password', -1)),
          createBaseVNode('div', _hoisted_2$g, [
            createBaseVNode(
              'input',
              {
                type: n.value ? 'text' : 'password',
                value: t.modelValue,
                onInput: s[0] || (s[0] = (r) => o.$emit('update:modelValue', r.target.value)),
                required: '',
              },
              null,
              40,
              _hoisted_3$e,
            ),
            n.value
              ? (openBlock(),
                createBlock(unref(ViewOff20), {
                  key: 1,
                  onClick: s[2] || (s[2] = (r) => (n.value = !1)),
                }))
              : (openBlock(),
                createBlock(unref(View20), {
                  key: 0,
                  onClick: s[1] || (s[1] = (r) => (n.value = !0)),
                })),
          ]),
        ])
      )
    },
  },
  PasswordField = _export_sfc(_sfc_main$g, [['__scopeId', 'data-v-b7a3465e']]),
  _hoisted_1$f = { class: 'toast-container bottom-center' },
  _hoisted_2$f = { class: 'toast-icon' },
  _hoisted_3$d = { class: 'toast-message' },
  _hoisted_4$c = ['onClick'],
  _sfc_main$f = {
    __name: 'Toast',
    setup(t) {
      const n = ToastPlugin.toasts,
        o = ToastPlugin.removeToast,
        s = {
          success: CheckmarkFilled20,
          error: ErrorFilled20,
          warning: WarningFilled20,
          info: InformationFilled20,
        },
        r = { success: '#43a047', error: '#d32f2f', warning: '#f9a825', info: '#1e88e5' }
      return (i, a) => (
        openBlock(),
        createElementBlock('div', _hoisted_1$f, [
          (openBlock(!0),
          createElementBlock(
            Fragment,
            null,
            renderList(
              unref(n),
              (c, u) => (
                openBlock(),
                createElementBlock('div', { key: u, class: 'toast' }, [
                  createBaseVNode('div', _hoisted_2$f, [
                    (openBlock(),
                    createBlock(
                      resolveDynamicComponent(s[c.type]),
                      { style: normalizeStyle({ color: r[c.type] }) },
                      null,
                      8,
                      ['style'],
                    )),
                  ]),
                  createBaseVNode('div', _hoisted_3$d, toDisplayString(c.message), 1),
                  createBaseVNode(
                    'button',
                    { class: 'toast-dismiss', onClick: (g) => unref(o)(c) },
                    '×',
                    8,
                    _hoisted_4$c,
                  ),
                ])
              ),
            ),
            128,
          )),
        ])
      )
    },
  },
  Toast = _export_sfc(_sfc_main$f, [['__scopeId', 'data-v-82d4f4c0']]),
  _hoisted_1$e = { class: 'login-container' },
  _hoisted_2$e = { class: 'login-card' },
  _hoisted_3$c = ['disabled'],
  _hoisted_4$b = { key: 0, class: 'error-msg' },
  _sfc_main$e = {
    __name: 'LoginView',
    setup(t) {
      const { proxy: n } = getCurrentInstance(),
        o = ref(''),
        s = ref(''),
        r = ref(''),
        i = ref(!1),
        a = useRouter()
      async function c() {
        ;(i.value = !0), (r.value = '')
        try {
          const g = await fetch('https://api-abealcala.duckdns.org/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: o.value, password: s.value }),
          })
          if (!g.ok) throw new Error('Invalid username or password')
          const d = await g.json()
          localStorage.setItem('token', d.token), await useUserStore().fetchMe(), a.push('/')
        } catch (g) {
          n.$toast({ message: g.message, type: 'error' })
        } finally {
          i.value = !1
        }
      }
      function u() {
        n.$toast({
          type: 'info',
          message: 'Please contact the system administrator to reset your password.',
        })
      }
      return (g, d) => (
        openBlock(),
        createElementBlock('div', _hoisted_1$e, [
          createBaseVNode('div', _hoisted_2$e, [
            d[2] ||
              (d[2] = createBaseVNode(
                'div',
                { class: 'logo' },
                [
                  createBaseVNode('img', {
                    src: _imports_0,
                    alt: 'ABE Logo',
                    width: '75',
                    height: '75',
                  }),
                  createBaseVNode('h1', null, 'ABE Alcala MIS'),
                  createBaseVNode(
                    'p',
                    { class: 'subtitle' },
                    ' Management Information System for Agricultural and Biosystems Engineers in Alcala ',
                  ),
                ],
                -1,
              )),
            createBaseVNode(
              'form',
              { onSubmit: withModifiers(c, ['prevent']), class: 'login-form' },
              [
                createVNode(
                  UserNameField,
                  {
                    modelValue: o.value,
                    'onUpdate:modelValue': d[0] || (d[0] = (v) => (o.value = v)),
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
                createVNode(
                  PasswordField,
                  {
                    modelValue: s.value,
                    'onUpdate:modelValue': d[1] || (d[1] = (v) => (s.value = v)),
                  },
                  null,
                  8,
                  ['modelValue'],
                ),
                createBaseVNode(
                  'button',
                  { class: 'login-button', disabled: i.value, type: 'submit' },
                  [
                    i.value
                      ? (openBlock(),
                        createElementBlock(
                          Fragment,
                          { key: 0 },
                          [createTextVNode(' Signing In... ')],
                          64,
                        ))
                      : (openBlock(),
                        createElementBlock(Fragment, { key: 1 }, [createTextVNode('Login')], 64)),
                  ],
                  8,
                  _hoisted_3$c,
                ),
                createBaseVNode('div', { class: 'forgot', onClick: u }, 'Forgot Password?'),
                r.value
                  ? (openBlock(),
                    createElementBlock('div', _hoisted_4$b, toDisplayString(r.value), 1))
                  : createCommentVNode('', !0),
              ],
              32,
            ),
          ]),
          createVNode(Toast),
        ])
      )
    },
  },
  LoginView = _export_sfc(_sfc_main$e, [['__scopeId', 'data-v-bca4193f']]),
  _hoisted_1$d = {
    border: '1',
    cellpadding: '6',
    cellspacing: '0',
    style: { 'margin-top': '1rem' },
  },
  _hoisted_2$d = ['onClick'],
  _hoisted_3$b = ['onClick'],
  _hoisted_4$a = { key: 0, class: 'modal' },
  _hoisted_5$a = { class: 'modal-content' },
  _hoisted_6$9 = { style: { 'margin-top': '1rem' } },
  _hoisted_7$7 = { key: 1, class: 'modal' },
  _hoisted_8$7 = { class: 'modal-content' },
  _hoisted_9$7 = { style: { 'margin-top': '1rem' } },
  _sfc_main$d = {
    __name: 'UsersView',
    setup(t) {
      const n = ref([]),
        o = ref(!1),
        s = ref(!1),
        r = ref(null),
        i = localStorage.getItem('token'),
        a = reactive({ username: '', name: '', email: '', password: '', is_admin: !1 }),
        c = reactive({ new: '', confirm: '' })
      async function u() {
        try {
          const A = await fetch('https://api-abealcala.duckdns.org/users', {
            headers: { Authorization: `Bearer ${i}` },
          })
          n.value = await A.json()
        } catch (A) {
          console.error('Fetch error:', A)
        }
      }
      async function g() {
        try {
          if (
            !(
              await fetch('https://api-abealcala.duckdns.org/create_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${i}` },
                body: JSON.stringify(a),
              })
            ).ok
          )
            throw new Error('Creation failed')
          alert('User created'), (o.value = !1), d(), await u()
        } catch (A) {
          alert('Create error: ' + A.message)
        }
      }
      function d() {
        ;(a.username = ''), (a.name = ''), (a.email = ''), (a.password = ''), (a.is_admin = !1)
      }
      function v(A) {
        const k = A.is_active ? 'Deactivate' : 'Activate'
        confirm(`Are you sure you want to ${k} ${A.username}?`) && y(A)
      }
      async function y(A) {
        try {
          if (
            !(
              await fetch(`https://api-abealcala.duckdns.org/toggle_user/${A.id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${i}` },
              })
            ).ok
          )
            throw new Error('Toggle failed')
          await u()
        } catch (k) {
          alert('Toggle error: ' + k.message)
        }
      }
      function _(A) {
        ;(r.value = A), (c.new = ''), (c.confirm = ''), (s.value = !0)
      }
      async function $() {
        if (c.new !== c.confirm) {
          alert('Passwords do not match')
          return
        }
        try {
          if (
            !(
              await fetch('https://api-abealcala.duckdns.org/update_password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${i}` },
                body: JSON.stringify({ user_id: r.value.id, new_password: c.new }),
              })
            ).ok
          )
            throw new Error('Password update failed')
          alert('Password updated'), (s.value = !1)
        } catch (A) {
          alert('Update error: ' + A.message)
        }
      }
      return (
        onMounted(u),
        (A, k) => (
          openBlock(),
          createElementBlock('div', null, [
            k[21] || (k[21] = createBaseVNode('h2', null, 'Users', -1)),
            createBaseVNode(
              'button',
              { onClick: k[0] || (k[0] = (O) => (o.value = !0)) },
              '+ Create User',
            ),
            createBaseVNode('table', _hoisted_1$d, [
              k[10] ||
                (k[10] = createBaseVNode(
                  'thead',
                  null,
                  [
                    createBaseVNode('tr', null, [
                      createBaseVNode('th', null, 'ID'),
                      createBaseVNode('th', null, 'Username'),
                      createBaseVNode('th', null, 'Name'),
                      createBaseVNode('th', null, 'Email'),
                      createBaseVNode('th', null, 'Admin'),
                      createBaseVNode('th', null, 'Active'),
                      createBaseVNode('th', null, 'Actions'),
                    ]),
                  ],
                  -1,
                )),
              createBaseVNode('tbody', null, [
                (openBlock(!0),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(
                    n.value,
                    (O) => (
                      openBlock(),
                      createElementBlock('tr', { key: O.id }, [
                        createBaseVNode('td', null, toDisplayString(O.id), 1),
                        createBaseVNode('td', null, toDisplayString(O.username), 1),
                        createBaseVNode('td', null, toDisplayString(O.name ?? '-'), 1),
                        createBaseVNode('td', null, toDisplayString(O.email ?? '-'), 1),
                        createBaseVNode('td', null, toDisplayString(O.is_admin ? 'Yes' : 'No'), 1),
                        createBaseVNode('td', null, toDisplayString(O.is_active ? 'Yes' : 'No'), 1),
                        createBaseVNode('td', null, [
                          createBaseVNode(
                            'button',
                            { onClick: (j) => v(O) },
                            'Toggle Active',
                            8,
                            _hoisted_2$d,
                          ),
                          createBaseVNode(
                            'button',
                            { onClick: (j) => _(O) },
                            'Update Password',
                            8,
                            _hoisted_3$b,
                          ),
                        ]),
                      ])
                    ),
                  ),
                  128,
                )),
              ]),
            ]),
            o.value
              ? (openBlock(),
                createElementBlock('div', _hoisted_4$a, [
                  createBaseVNode('div', _hoisted_5$a, [
                    k[17] || (k[17] = createBaseVNode('h3', null, 'Create User', -1)),
                    createBaseVNode(
                      'form',
                      { onSubmit: withModifiers(g, ['prevent']) },
                      [
                        createBaseVNode('div', null, [
                          k[11] || (k[11] = createBaseVNode('label', null, 'Username:', -1)),
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue': k[1] || (k[1] = (O) => (a.username = O)),
                                required: '',
                              },
                              null,
                              512,
                            ),
                            [[vModelText, a.username]],
                          ),
                        ]),
                        createBaseVNode('div', null, [
                          k[12] || (k[12] = createBaseVNode('label', null, 'Name:', -1)),
                          withDirectives(
                            createBaseVNode(
                              'input',
                              { 'onUpdate:modelValue': k[2] || (k[2] = (O) => (a.name = O)) },
                              null,
                              512,
                            ),
                            [[vModelText, a.name]],
                          ),
                        ]),
                        createBaseVNode('div', null, [
                          k[13] || (k[13] = createBaseVNode('label', null, 'Email:', -1)),
                          withDirectives(
                            createBaseVNode(
                              'input',
                              { 'onUpdate:modelValue': k[3] || (k[3] = (O) => (a.email = O)) },
                              null,
                              512,
                            ),
                            [[vModelText, a.email]],
                          ),
                        ]),
                        createBaseVNode('div', null, [
                          k[14] || (k[14] = createBaseVNode('label', null, 'Password:', -1)),
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                type: 'password',
                                'onUpdate:modelValue': k[4] || (k[4] = (O) => (a.password = O)),
                                required: '',
                              },
                              null,
                              512,
                            ),
                            [[vModelText, a.password]],
                          ),
                        ]),
                        createBaseVNode('div', null, [
                          createBaseVNode('label', null, [
                            withDirectives(
                              createBaseVNode(
                                'input',
                                {
                                  type: 'checkbox',
                                  'onUpdate:modelValue': k[5] || (k[5] = (O) => (a.is_admin = O)),
                                },
                                null,
                                512,
                              ),
                              [[vModelCheckbox, a.is_admin]],
                            ),
                            k[15] || (k[15] = createTextVNode(' Is Admin')),
                          ]),
                        ]),
                        createBaseVNode('div', _hoisted_6$9, [
                          k[16] ||
                            (k[16] = createBaseVNode('button', { type: 'submit' }, 'Create', -1)),
                          createBaseVNode(
                            'button',
                            {
                              type: 'button',
                              onClick: k[6] || (k[6] = (O) => (o.value = !1)),
                              style: { 'margin-left': '1rem' },
                            },
                            ' Cancel ',
                          ),
                        ]),
                      ],
                      32,
                    ),
                  ]),
                ]))
              : createCommentVNode('', !0),
            s.value
              ? (openBlock(),
                createElementBlock('div', _hoisted_7$7, [
                  createBaseVNode('div', _hoisted_8$7, [
                    createBaseVNode(
                      'h3',
                      null,
                      'Update Password: ' + toDisplayString(r.value.username),
                      1,
                    ),
                    createBaseVNode(
                      'form',
                      { onSubmit: withModifiers($, ['prevent']) },
                      [
                        createBaseVNode('div', null, [
                          k[18] || (k[18] = createBaseVNode('label', null, 'New Password:', -1)),
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                type: 'password',
                                'onUpdate:modelValue': k[7] || (k[7] = (O) => (c.new = O)),
                                required: '',
                              },
                              null,
                              512,
                            ),
                            [[vModelText, c.new]],
                          ),
                        ]),
                        createBaseVNode('div', null, [
                          k[19] ||
                            (k[19] = createBaseVNode('label', null, 'Confirm Password:', -1)),
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                type: 'password',
                                'onUpdate:modelValue': k[8] || (k[8] = (O) => (c.confirm = O)),
                                required: '',
                              },
                              null,
                              512,
                            ),
                            [[vModelText, c.confirm]],
                          ),
                        ]),
                        createBaseVNode('div', _hoisted_9$7, [
                          k[20] ||
                            (k[20] = createBaseVNode('button', { type: 'submit' }, 'Update', -1)),
                          createBaseVNode(
                            'button',
                            {
                              type: 'button',
                              onClick: k[9] || (k[9] = (O) => (s.value = !1)),
                              style: { 'margin-left': '1rem' },
                            },
                            ' Cancel ',
                          ),
                        ]),
                      ],
                      32,
                    ),
                  ]),
                ]))
              : createCommentVNode('', !0),
          ])
        )
      )
    },
  },
  UsersView = _export_sfc(_sfc_main$d, [['__scopeId', 'data-v-b537cca3']]),
  _hoisted_1$c = { class: 'title-bar' },
  _hoisted_2$c = { class: 'title-text' },
  _sfc_main$c = {
    __name: 'TitleBar',
    props: { title: String, icon: Object },
    setup(t) {
      return (n, o) => (
        openBlock(),
        createElementBlock('div', _hoisted_1$c, [
          createBaseVNode('h1', _hoisted_2$c, toDisplayString(t.title), 1),
        ])
      )
    },
  },
  TitleBar = _export_sfc(_sfc_main$c, [['__scopeId', 'data-v-f8a4c8a8']]),
  _hoisted_1$b = { class: 'data-table' },
  _hoisted_2$b = ['onClick'],
  _hoisted_3$a = { key: 0 },
  _hoisted_4$9 = { key: 0 },
  _hoisted_5$9 = { key: 0 },
  _sfc_main$b = {
    __name: 'DataTable',
    props: { data: Array, columns: Array, sort: Object, onSort: Function },
    setup(t) {
      return (n, o) => (
        openBlock(),
        createElementBlock('div', _hoisted_1$b, [
          createBaseVNode('table', null, [
            createBaseVNode('thead', null, [
              createBaseVNode('tr', null, [
                (openBlock(!0),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(
                    t.columns,
                    (s) => (
                      openBlock(),
                      createElementBlock(
                        'th',
                        { key: s.key, onClick: (r) => s.sortable && t.onSort(s.key) },
                        [
                          createTextVNode(toDisplayString(s.label) + ' ', 1),
                          t.sort.column === s.key
                            ? (openBlock(),
                              createElementBlock(
                                'span',
                                _hoisted_3$a,
                                toDisplayString(t.sort.order === 'asc' ? '▲' : '▼'),
                                1,
                              ))
                            : createCommentVNode('', !0),
                        ],
                        8,
                        _hoisted_2$b,
                      )
                    ),
                  ),
                  128,
                )),
                n.$slots.actions
                  ? (openBlock(), createElementBlock('th', _hoisted_4$9, 'Actions'))
                  : createCommentVNode('', !0),
              ]),
            ]),
            createBaseVNode('tbody', null, [
              (openBlock(!0),
              createElementBlock(
                Fragment,
                null,
                renderList(
                  t.data,
                  (s) => (
                    openBlock(),
                    createElementBlock('tr', { key: s.id }, [
                      (openBlock(!0),
                      createElementBlock(
                        Fragment,
                        null,
                        renderList(
                          t.columns,
                          (r) => (
                            openBlock(),
                            createElementBlock('td', { key: r.key }, toDisplayString(s[r.key]), 1)
                          ),
                        ),
                        128,
                      )),
                      n.$slots.actions
                        ? (openBlock(),
                          createElementBlock('td', _hoisted_5$9, [
                            renderSlot(n.$slots, 'actions', { row: s }, void 0, !0),
                          ]))
                        : createCommentVNode('', !0),
                    ])
                  ),
                ),
                128,
              )),
            ]),
          ]),
        ])
      )
    },
  },
  DataTable = _export_sfc(_sfc_main$b, [['__scopeId', 'data-v-cbef72ac']]),
  _hoisted_1$a = { class: 'container' },
  _hoisted_2$a = { class: 'filters' },
  _hoisted_3$9 = { class: 'pagination' },
  _hoisted_4$8 = ['disabled'],
  _hoisted_5$8 = ['disabled'],
  _hoisted_6$8 = { class: 'limit' },
  _sfc_main$a = {
    __name: 'FcaView',
    setup(t) {
      const n = useRouter(),
        o = localStorage.getItem('token'),
        s = ref([]),
        r = ref(0),
        i = ref({ keyword: '', type: '', major_commodity: '' }),
        a = ref({ column: 'name', order: 'asc' }),
        c = ref({ page: 1, limit: 10 }),
        u = [
          { label: 'ID', key: 'id' },
          { label: 'Name', key: 'name', sortable: !0 },
          { label: 'Acronym', key: 'acronym', sortable: !0 },
          { label: 'Type', key: 'type', sortable: !0 },
          { label: 'Municipality', key: 'municipality' },
          { label: 'Province', key: 'province' },
          { label: 'Major Commodity', key: 'major_commodity' },
          { label: 'Members', key: 'total_members' },
        ],
        g = computed(() => Math.ceil(r.value / c.value.limit))
      function d(A) {
        a.value.column === A
          ? (a.value.order = a.value.order === 'asc' ? 'desc' : 'asc')
          : ((a.value.column = A), (a.value.order = 'asc')),
          $()
      }
      function v() {
        ;(i.value = { keyword: '', type: '', major_commodity: '' }), (c.value.page = 1), $()
      }
      function y(A) {
        n.push(`/fca/${A}`)
      }
      async function _(A) {
        if (confirm('Are you sure you want to delete this FCA?'))
          try {
            const k = await fetch(`https://api-abealcala.duckdns.org/fcas/${A}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${o}` },
            })
            if (!k.ok) {
              const O = await k.json()
              throw new Error(O.message || 'Failed to delete FCA.')
            }
            alert(`Deleted FCA ${A}`), await $()
          } catch (k) {
            alert('Error: ' + k.message)
          }
      }
      async function $() {
        const A = new URLSearchParams()
        i.value.keyword && A.append('filters', i.value.keyword),
          i.value.type && A.append('type', i.value.type),
          i.value.major_commodity && A.append('major_commodity', i.value.major_commodity),
          A.append('sort', a.value.column),
          A.append('order', a.value.order),
          A.append('page', c.value.page),
          A.append('limit', c.value.limit)
        try {
          const O = await (
            await fetch(`https://api-abealcala.duckdns.org/fcas?${A}`, {
              headers: { Authorization: `Bearer ${o}` },
            })
          ).json()
          ;(s.value = O.data), (r.value = O.total)
        } catch (k) {
          alert('Error: ' + k.message)
        }
      }
      return (
        onMounted($),
        (A, k) => (
          openBlock(),
          createElementBlock('div', _hoisted_1$a, [
            createVNode(
              TitleBar,
              { title: "Farmers' Cooperative Associations", icon: unref(Home20) },
              null,
              8,
              ['icon'],
            ),
            createBaseVNode('div', _hoisted_2$a, [
              withDirectives(
                createBaseVNode(
                  'input',
                  {
                    'onUpdate:modelValue': k[0] || (k[0] = (O) => (i.value.keyword = O)),
                    placeholder: 'Search...',
                  },
                  null,
                  512,
                ),
                [[vModelText, i.value.keyword]],
              ),
              withDirectives(
                createBaseVNode(
                  'select',
                  { 'onUpdate:modelValue': k[1] || (k[1] = (O) => (i.value.type = O)) },
                  k[7] ||
                    (k[7] = [
                      createBaseVNode('option', { value: '' }, 'All Types', -1),
                      createBaseVNode('option', { value: 'Cooperative' }, 'Cooperative', -1),
                      createBaseVNode('option', { value: 'Association' }, 'Association', -1),
                    ]),
                  512,
                ),
                [[vModelSelect, i.value.type]],
              ),
              withDirectives(
                createBaseVNode(
                  'select',
                  { 'onUpdate:modelValue': k[2] || (k[2] = (O) => (i.value.major_commodity = O)) },
                  k[8] ||
                    (k[8] = [
                      createBaseVNode('option', { value: '' }, 'All Commodities', -1),
                      createBaseVNode('option', { value: 'Rice' }, 'Rice', -1),
                      createBaseVNode('option', { value: 'Corn' }, 'Corn', -1),
                      createBaseVNode('option', { value: 'Peanuts' }, 'Peanuts', -1),
                    ]),
                  512,
                ),
                [[vModelSelect, i.value.major_commodity]],
              ),
              createBaseVNode('button', { onClick: v }, 'Reset'),
              createBaseVNode('button', { onClick: $ }, 'Apply'),
            ]),
            createVNode(
              DataTable,
              { data: s.value, columns: u, sort: a.value, onSort: d },
              {
                actions: withCtx(({ row: O }) => [
                  createVNode(
                    unref(View20),
                    { title: 'View', class: 'action-icon', onClick: (j) => y(O.id) },
                    null,
                    8,
                    ['onClick'],
                  ),
                  createVNode(
                    unref(TrashCan20),
                    { title: 'Delete', class: 'action-icon text-red', onClick: (j) => _(O.id) },
                    null,
                    8,
                    ['onClick'],
                  ),
                ]),
                _: 1,
              },
              8,
              ['data', 'sort'],
            ),
            createBaseVNode('div', _hoisted_3$9, [
              createBaseVNode('div', null, [
                createBaseVNode(
                  'button',
                  {
                    disabled: c.value.page === 1,
                    onClick: k[3] || (k[3] = (O) => c.value.page-- && $()),
                  },
                  ' Prev ',
                  8,
                  _hoisted_4$8,
                ),
                createBaseVNode(
                  'span',
                  null,
                  'Page ' + toDisplayString(c.value.page) + ' of ' + toDisplayString(g.value),
                  1,
                ),
                createBaseVNode(
                  'button',
                  {
                    disabled: c.value.page >= g.value,
                    onClick: k[4] || (k[4] = (O) => c.value.page++ && $()),
                  },
                  ' Next ',
                  8,
                  _hoisted_5$8,
                ),
              ]),
              createBaseVNode('div', _hoisted_6$8, [
                k[10] || (k[10] = createBaseVNode('label', null, 'Rows per page:', -1)),
                withDirectives(
                  createBaseVNode(
                    'select',
                    {
                      'onUpdate:modelValue': k[5] || (k[5] = (O) => (c.value.limit = O)),
                      onChange: k[6] || (k[6] = (O) => $()),
                    },
                    k[9] ||
                      (k[9] = [
                        createBaseVNode('option', { value: 10 }, '10', -1),
                        createBaseVNode('option', { value: 20 }, '20', -1),
                        createBaseVNode('option', { value: 50 }, '50', -1),
                      ]),
                    544,
                  ),
                  [[vModelSelect, c.value.limit]],
                ),
              ]),
            ]),
          ])
        )
      )
    },
  },
  FcaView = _export_sfc(_sfc_main$a, [['__scopeId', 'data-v-1a0ff93a']]),
  _hoisted_1$9 = { class: 'modal-content' },
  _hoisted_2$9 = { class: 'modal-title' },
  _sfc_main$9 = {
    __name: 'Modal',
    props: { title: String },
    emits: ['close'],
    setup(t) {
      return (n, o) => (
        openBlock(),
        createElementBlock(
          'div',
          {
            class: 'modal-overlay',
            onClick: o[0] || (o[0] = withModifiers((s) => n.$emit('close'), ['self'])),
          },
          [
            createBaseVNode('div', _hoisted_1$9, [
              createBaseVNode('h3', _hoisted_2$9, toDisplayString(t.title), 1),
              renderSlot(n.$slots, 'default', {}, void 0, !0),
            ]),
          ],
        )
      )
    },
  },
  Modal = _export_sfc(_sfc_main$9, [['__scopeId', 'data-v-54116682']]),
  _hoisted_1$8 = { class: 'document-settings' },
  _hoisted_2$8 = { class: 'actions' },
  _hoisted_3$8 = { class: 'group-filters' },
  _hoisted_4$7 = ['onClick'],
  _hoisted_5$7 = ['onClick'],
  _hoisted_6$7 = ['onClick'],
  _hoisted_7$6 = ['onClick'],
  _hoisted_8$6 = ['onClick'],
  _hoisted_9$6 = ['onClick'],
  _hoisted_10$4 = { class: 'pagination' },
  _hoisted_11$4 = ['disabled'],
  _hoisted_12$3 = ['disabled'],
  _hoisted_13$2 = { class: 'modal-actions' },
  _hoisted_14$2 = { class: 'modal-actions' },
  _hoisted_15$2 = ['value'],
  _hoisted_16$2 = { class: 'modal-actions' },
  _sfc_main$8 = {
    __name: 'DocumentSettings',
    setup(t) {
      const n = localStorage.getItem('token'),
        o = useRouter(),
        s = ref([]),
        r = ref([]),
        i = ref(0),
        a = ref(null),
        c = ref({ column: 'name', order: 'asc' }),
        u = ref({ page: 1, limit: 10 }),
        g = computed(() => Math.ceil(i.value / u.value.limit)),
        d = ref(!1),
        v = ref(''),
        y = ref(!1),
        _ = ref(null),
        $ = ref(''),
        A = ref(!1),
        k = ref(null),
        O = ref({ group_id: '', name: '', file: null }),
        j = [
          { label: 'Name', key: 'name', sortable: !0 },
          { label: 'Group', key: 'group_name', sortable: !0 },
          { label: 'File', key: 'file_uri' },
        ]
      function B(je) {
        c.value.column === je
          ? (c.value.order = c.value.order === 'asc' ? 'desc' : 'asc')
          : ((c.value.column = je), (c.value.order = 'asc')),
          F()
      }
      async function P() {
        const je = await fetch('https://api-abealcala.duckdns.org/groups', {
          headers: { Authorization: `Bearer ${n}` },
        })
        s.value = await je.json()
      }
      async function F() {
        const je = new URL('https://api-abealcala.duckdns.org/documents')
        a.value && je.searchParams.set('group', a.value),
          je.searchParams.set('sort', c.value.column),
          je.searchParams.set('order', c.value.order),
          je.searchParams.set('page', u.value.page),
          je.searchParams.set('limit', u.value.limit)
        const xe = await (await fetch(je, { headers: { Authorization: `Bearer ${n}` } })).json()
        ;(r.value = xe.data || []), (i.value = xe.total || xe.length || 0)
      }
      async function Be() {
        await fetch('https://api-abealcala.duckdns.org/group', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${n}` },
          body: JSON.stringify({ name: v.value }),
        }),
          (d.value = !1),
          (v.value = ''),
          P()
      }
      function Se(je) {
        ;(_.value = je), ($.value = je.name), (y.value = !0)
      }
      async function L() {
        await fetch('https://api-abealcala.duckdns.org/group', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${n}` },
          body: JSON.stringify({ id: _.value.id, name: $.value }),
        }),
          (y.value = !1),
          P()
      }
      function R(je = null) {
        ;(A.value = !0),
          je
            ? ((k.value = je), (O.value = { group_id: je.group_id, name: je.name, file: null }))
            : ((k.value = null), (O.value = { group_id: '', name: '', file: null }))
      }
      async function D() {
        const je = k.value,
          Pe = new FormData()
        Pe.append('group_id', O.value.group_id),
          Pe.append('name', O.value.name),
          O.value.file && Pe.append('file', O.value.file)
        const xe = je
          ? `https://api-abealcala.duckdns.org/document/${k.value.id}`
          : 'https://api-abealcala.duckdns.org/document'
        await fetch(xe, { method: 'POST', headers: { Authorization: `Bearer ${n}` }, body: Pe }),
          (A.value = !1),
          F()
      }
      async function Te(je) {
        confirm('Delete this document?') &&
          (await fetch(`https://api-abealcala.duckdns.org/document/${je.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${n}` },
          }),
          F())
      }
      async function K(je) {
        confirm('Delete this group?') &&
          (await fetch(`https://api-abealcala.duckdns.org/group/${je}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${n}` },
          }),
          a.value === je && (a.value = null),
          P(),
          F())
      }
      function De(je) {
        o.push(`/settings/document/${je.id}`)
      }
      return (
        watch([a, () => u.value.limit], () => {
          ;(u.value.page = 1), F()
        }),
        onMounted(() => {
          P(), F()
        }),
        (je, Pe) => (
          openBlock(),
          createElementBlock('div', _hoisted_1$8, [
            createBaseVNode('div', _hoisted_2$8, [
              createBaseVNode(
                'button',
                { class: 'green-btn', onClick: Pe[0] || (Pe[0] = (xe) => (d.value = !0)) },
                '+ New Group',
              ),
              createBaseVNode(
                'button',
                { class: 'green-btn', onClick: Pe[1] || (Pe[1] = (xe) => R()) },
                '+ New Document',
              ),
            ]),
            createBaseVNode('div', _hoisted_3$8, [
              createBaseVNode(
                'button',
                {
                  class: normalizeClass({ active: !a.value }),
                  onClick: Pe[2] || (Pe[2] = (xe) => (a.value = null)),
                },
                'All',
                2,
              ),
              (openBlock(!0),
              createElementBlock(
                Fragment,
                null,
                renderList(
                  s.value,
                  (xe) => (
                    openBlock(),
                    createElementBlock(
                      'button',
                      {
                        key: xe.id,
                        class: normalizeClass({ active: xe.id === a.value }),
                        onClick: (Ze) => (a.value = xe.id),
                      },
                      [
                        createTextVNode(toDisplayString(xe.name) + ' ', 1),
                        createBaseVNode(
                          'span',
                          { class: 'edit', onClick: withModifiers((Ze) => Se(xe), ['stop']) },
                          '✎',
                          8,
                          _hoisted_5$7,
                        ),
                        createBaseVNode(
                          'span',
                          { class: 'x', onClick: withModifiers((Ze) => K(xe.id), ['stop']) },
                          '×',
                          8,
                          _hoisted_6$7,
                        ),
                      ],
                      10,
                      _hoisted_4$7,
                    )
                  ),
                ),
                128,
              )),
            ]),
            createVNode(
              DataTable,
              { data: r.value, columns: j, sort: c.value, onSort: B },
              {
                actions: withCtx(({ row: xe }) => [
                  createBaseVNode('button', { onClick: (Ze) => R(xe) }, 'Edit', 8, _hoisted_7$6),
                  createBaseVNode('button', { onClick: (Ze) => De(xe) }, 'View', 8, _hoisted_8$6),
                  createBaseVNode(
                    'button',
                    { onClick: (Ze) => Te(xe), class: 'text-red' },
                    'Delete',
                    8,
                    _hoisted_9$6,
                  ),
                ]),
                _: 1,
              },
              8,
              ['data', 'sort'],
            ),
            createBaseVNode('div', _hoisted_10$4, [
              createBaseVNode(
                'button',
                {
                  disabled: u.value.page === 1,
                  onClick: Pe[3] || (Pe[3] = (xe) => u.value.page-- && F()),
                },
                ' Prev ',
                8,
                _hoisted_11$4,
              ),
              createBaseVNode(
                'span',
                null,
                'Page ' + toDisplayString(u.value.page) + ' of ' + toDisplayString(g.value),
                1,
              ),
              createBaseVNode(
                'button',
                {
                  disabled: u.value.page >= g.value,
                  onClick: Pe[4] || (Pe[4] = (xe) => u.value.page++ && F()),
                },
                ' Next ',
                8,
                _hoisted_12$3,
              ),
              withDirectives(
                createBaseVNode(
                  'select',
                  {
                    'onUpdate:modelValue': Pe[5] || (Pe[5] = (xe) => (u.value.limit = xe)),
                    onChange: Pe[6] || (Pe[6] = (xe) => F()),
                  },
                  Pe[18] ||
                    (Pe[18] = [
                      createBaseVNode('option', { value: 10 }, '10', -1),
                      createBaseVNode('option', { value: 20 }, '20', -1),
                      createBaseVNode('option', { value: 50 }, '50', -1),
                    ]),
                  544,
                ),
                [[vModelSelect, u.value.limit]],
              ),
            ]),
            d.value
              ? (openBlock(),
                createBlock(
                  Modal,
                  {
                    key: 0,
                    title: 'New Group',
                    onClose: Pe[9] || (Pe[9] = (xe) => (d.value = !1)),
                  },
                  {
                    default: withCtx(() => [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue': Pe[7] || (Pe[7] = (xe) => (v.value = xe)),
                            placeholder: 'Group Name',
                          },
                          null,
                          512,
                        ),
                        [[vModelText, v.value]],
                      ),
                      createBaseVNode('div', _hoisted_13$2, [
                        createBaseVNode('button', { class: 'green-btn', onClick: Be }, 'Create'),
                        createBaseVNode(
                          'button',
                          { onClick: Pe[8] || (Pe[8] = (xe) => (d.value = !1)) },
                          'Cancel',
                        ),
                      ]),
                    ]),
                    _: 1,
                  },
                ))
              : createCommentVNode('', !0),
            y.value
              ? (openBlock(),
                createBlock(
                  Modal,
                  {
                    key: 1,
                    title: 'Edit Group',
                    onClose: Pe[12] || (Pe[12] = (xe) => (y.value = !1)),
                  },
                  {
                    default: withCtx(() => [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          { 'onUpdate:modelValue': Pe[10] || (Pe[10] = (xe) => ($.value = xe)) },
                          null,
                          512,
                        ),
                        [[vModelText, $.value]],
                      ),
                      createBaseVNode('div', _hoisted_14$2, [
                        createBaseVNode('button', { class: 'green-btn', onClick: L }, 'Save'),
                        createBaseVNode(
                          'button',
                          { onClick: Pe[11] || (Pe[11] = (xe) => (y.value = !1)) },
                          'Cancel',
                        ),
                      ]),
                    ]),
                    _: 1,
                  },
                ))
              : createCommentVNode('', !0),
            A.value
              ? (openBlock(),
                createBlock(
                  Modal,
                  {
                    key: 2,
                    title: k.value ? 'Edit Document' : 'New Document',
                    onClose: Pe[17] || (Pe[17] = (xe) => (A.value = !1)),
                  },
                  {
                    default: withCtx(() => [
                      withDirectives(
                        createBaseVNode(
                          'select',
                          {
                            'onUpdate:modelValue':
                              Pe[13] || (Pe[13] = (xe) => (O.value.group_id = xe)),
                          },
                          [
                            (openBlock(!0),
                            createElementBlock(
                              Fragment,
                              null,
                              renderList(
                                s.value,
                                (xe) => (
                                  openBlock(),
                                  createElementBlock(
                                    'option',
                                    { value: xe.id, key: xe.id },
                                    toDisplayString(xe.name),
                                    9,
                                    _hoisted_15$2,
                                  )
                                ),
                              ),
                              128,
                            )),
                          ],
                          512,
                        ),
                        [[vModelSelect, O.value.group_id]],
                      ),
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue': Pe[14] || (Pe[14] = (xe) => (O.value.name = xe)),
                            placeholder: 'Document Name',
                          },
                          null,
                          512,
                        ),
                        [[vModelText, O.value.name]],
                      ),
                      createBaseVNode(
                        'input',
                        {
                          type: 'file',
                          onChange:
                            Pe[15] || (Pe[15] = (xe) => (O.value.file = xe.target.files[0])),
                        },
                        null,
                        32,
                      ),
                      createBaseVNode('div', _hoisted_16$2, [
                        createBaseVNode('button', { class: 'green-btn', onClick: D }, 'Save'),
                        createBaseVNode(
                          'button',
                          { onClick: Pe[16] || (Pe[16] = (xe) => (A.value = !1)) },
                          'Cancel',
                        ),
                      ]),
                    ]),
                    _: 1,
                  },
                  8,
                  ['title'],
                ))
              : createCommentVNode('', !0),
          ])
        )
      )
    },
  },
  DocumentSettings = _export_sfc(_sfc_main$8, [['__scopeId', 'data-v-32a4bb37']]),
  _hoisted_1$7 = { class: 'container' },
  _hoisted_2$7 = { key: 0 },
  _hoisted_3$7 = { key: 1 },
  _hoisted_4$6 = ['onUpdate:modelValue'],
  _hoisted_5$6 = ['value'],
  _hoisted_6$6 = ['onUpdate:modelValue'],
  _hoisted_7$5 = ['onUpdate:modelValue'],
  _hoisted_8$5 = ['onUpdate:modelValue'],
  _hoisted_9$5 = ['onUpdate:modelValue'],
  _hoisted_10$3 = { key: 0 },
  _hoisted_11$3 = ['onUpdate:modelValue'],
  _hoisted_12$2 = ['onUpdate:modelValue'],
  _hoisted_13$1 = ['onClick'],
  _hoisted_14$1 = ['onClick'],
  _hoisted_15$1 = { key: 1 },
  _hoisted_16$1 = ['onUpdate:modelValue'],
  _hoisted_17$1 = ['onUpdate:modelValue'],
  _hoisted_18$1 = ['value'],
  _hoisted_19$1 = ['onUpdate:modelValue'],
  _hoisted_20$1 = { key: 0 },
  _hoisted_21$1 = ['onUpdate:modelValue'],
  _hoisted_22$1 = ['onClick'],
  _hoisted_23$1 = ['onClick'],
  _hoisted_24$1 = ['onUpdate:modelValue'],
  _hoisted_25$1 = ['onUpdate:modelValue'],
  _hoisted_26$1 = ['onUpdate:modelValue'],
  _hoisted_27$1 = ['onClick'],
  _hoisted_28$1 = ['onClick'],
  _hoisted_29$1 = ['onClick'],
  _hoisted_30$1 = { style: { margin: '8px 0' } },
  _hoisted_31$1 = { style: { background: '#f3f3f3', padding: '4px 8px', 'border-radius': '4px' } },
  _hoisted_32$1 = ['onClick'],
  _hoisted_33$1 = ['id'],
  _hoisted_34$1 = ['innerHTML'],
  _hoisted_35$1 = ['innerHTML'],
  _hoisted_36$1 = ['innerHTML'],
  _hoisted_37$1 = ['onClick'],
  _sfc_main$7 = {
    __name: 'DocumentSchema',
    setup(t) {
      const { proxy: n } = getCurrentInstance(),
        o = [
          'text',
          'number',
          'money',
          'date',
          'table',
          'boolean',
          'dropdown',
          'checkbox',
          'radio',
        ],
        s = reactive([]),
        r = ref(null),
        i = useRoute(),
        a = useRouter(),
        c = ref(!1),
        u = async () => {
          c.value = !0
          const Be = localStorage.getItem('token'),
            Se = i.params.id,
            R = await (
              await fetch(`https://api-abealcala.duckdns.org/document/${Se}`, {
                headers: { Authorization: `Bearer ${Be}` },
              })
            ).json()
          ;(r.value = R),
            R.schema && (console.log('Schema', R.schema), s.splice(0, s.length, ...R.schema)),
            (c.value = !1)
        }
      onMounted(() => {
        u()
      })
      const g = (Be) => `{{${B(Be)}}}`,
        d = () => {
          s.push({
            field_type: 'text',
            field_label: '',
            properties: {
              required: !1,
              disabled: !1,
              hidden: !1,
              options: [],
              multiple: !1,
              min_rows: 0,
              columns: [],
            },
          })
        },
        v = (Be) => {
          s.splice(Be, 1)
        },
        y = (Be) => {
          Be.properties.columns.push({
            field_type: 'text',
            field_label: '',
            properties: { required: !1, disabled: !1, hidden: !1, options: [] },
          })
        },
        _ = async () => {
          try {
            const Be = localStorage.getItem('token')
            if (!Be) {
              n.$toast({ type: 'error', message: 'Authentication token missing.' })
              return
            }
            const Se = new FormData()
            Se.append('group_id', r.value.group_id),
              Se.append('name', r.value.name),
              Se.append('file_path', r.value.file_path || ''),
              Se.append('schema', JSON.stringify(s))
            const L = await fetch(`https://api-abealcala.duckdns.org/document/${r.value.id}`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${Be}` },
              body: Se,
            })
            if (!L.ok) {
              const R = await L.text()
              throw new Error(R || 'Failed to submit document')
            }
            n.$toast({ type: 'success', message: 'Document submitted successfully.' }),
              a.push('/settings/templates')
          } catch (Be) {
            console.error(Be),
              n.$toast({
                type: 'error',
                message: 'An error occurred while submitting the document.',
              }),
              alert('Error: ' + Be.message)
          }
        },
        $ = () => {
          a.push('/settings/templates')
        }
      function A(Be) {
        return Be.replace(/{{/g, '&#123;&#123;').replace(/}}/g, '&#125;&#125;')
      }
      function k(Be) {
        return A(`{{FOR row IN ${B(Be)}}}`)
      }
      function O(Be) {
        return A(`{{= $row.${B(Be)}}}`)
      }
      function j() {
        return A('{{END-FOR row}}')
      }
      function B(Be) {
        return Be
          ? Be.replace(/[^a-zA-Z0-9_\s]/g, '')
              .replace(/[_\s]+(.)?/g, (Se, L) => (L ? L.toUpperCase() : ''))
              .replace(/^(.)/, (Se) => Se.toUpperCase())
          : ''
      }
      function P(Be) {
        const Se = Be
        navigator.clipboard.writeText(Se)
      }
      function F(Be) {
        nextTick(() => {
          const Se = document.getElementById('table-' + Be)
          if (!Se) return
          const L = Se.cloneNode(!0)
          L.querySelectorAll('th, td').forEach((K) => {
            ;(K.style.fontFamily = 'Arial'),
              (K.style.border = '1px solid black'),
              (K.style.padding = '6px')
          }),
            (L.style.borderCollapse = 'collapse'),
            (L.style.fontFamily = 'Arial')
          const R = document.createElement('div')
          R.appendChild(L), document.body.appendChild(R)
          const D = document.createRange()
          D.selectNode(R)
          const Te = window.getSelection()
          Te.removeAllRanges(), Te.addRange(D)
          try {
            document.execCommand('copy')
          } catch {}
          Te.removeAllRanges(), document.body.removeChild(R)
        })
      }
      return (Be, Se) => (
        openBlock(),
        createElementBlock('div', _hoisted_1$7, [
          Se[14] || (Se[14] = createBaseVNode('h2', null, 'Dynamic Schema Builder', -1)),
          c.value
            ? (openBlock(), createElementBlock('div', _hoisted_2$7, 'Loading...'))
            : (openBlock(),
              createElementBlock('div', _hoisted_3$7, [
                (openBlock(!0),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(
                    s,
                    (L, R) => (
                      openBlock(),
                      createElementBlock('div', { key: R, class: 'field-config' }, [
                        createBaseVNode('div', null, [
                          Se[0] || (Se[0] = createBaseVNode('label', null, 'Field Type:', -1)),
                          withDirectives(
                            createBaseVNode(
                              'select',
                              { 'onUpdate:modelValue': (D) => (L.field_type = D) },
                              [
                                (openBlock(),
                                createElementBlock(
                                  Fragment,
                                  null,
                                  renderList(o, (D) =>
                                    createBaseVNode(
                                      'option',
                                      { key: D, value: D },
                                      toDisplayString(D),
                                      9,
                                      _hoisted_5$6,
                                    ),
                                  ),
                                  64,
                                )),
                              ],
                              8,
                              _hoisted_4$6,
                            ),
                            [[vModelSelect, L.field_type]],
                          ),
                        ]),
                        createBaseVNode('div', null, [
                          Se[1] || (Se[1] = createBaseVNode('label', null, 'Field Label:', -1)),
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                'onUpdate:modelValue': (D) => (L.field_label = D),
                                placeholder: 'Label',
                              },
                              null,
                              8,
                              _hoisted_6$6,
                            ),
                            [[vModelText, L.field_label]],
                          ),
                        ]),
                        createBaseVNode('div', null, [
                          createBaseVNode('label', null, [
                            withDirectives(
                              createBaseVNode(
                                'input',
                                {
                                  type: 'checkbox',
                                  'onUpdate:modelValue': (D) => (L.properties.required = D),
                                },
                                null,
                                8,
                                _hoisted_7$5,
                              ),
                              [[vModelCheckbox, L.properties.required]],
                            ),
                            Se[2] || (Se[2] = createTextVNode(' Required')),
                          ]),
                          createBaseVNode('label', null, [
                            withDirectives(
                              createBaseVNode(
                                'input',
                                {
                                  type: 'checkbox',
                                  'onUpdate:modelValue': (D) => (L.properties.disabled = D),
                                },
                                null,
                                8,
                                _hoisted_8$5,
                              ),
                              [[vModelCheckbox, L.properties.disabled]],
                            ),
                            Se[3] || (Se[3] = createTextVNode(' Disabled')),
                          ]),
                          createBaseVNode('label', null, [
                            withDirectives(
                              createBaseVNode(
                                'input',
                                {
                                  type: 'checkbox',
                                  'onUpdate:modelValue': (D) => (L.properties.hidden = D),
                                },
                                null,
                                8,
                                _hoisted_9$5,
                              ),
                              [[vModelCheckbox, L.properties.hidden]],
                            ),
                            Se[4] || (Se[4] = createTextVNode(' Hidden')),
                          ]),
                        ]),
                        ['dropdown', 'radio', 'checkbox'].includes(L.field_type)
                          ? (openBlock(),
                            createElementBlock('div', _hoisted_10$3, [
                              createBaseVNode('label', null, [
                                withDirectives(
                                  createBaseVNode(
                                    'input',
                                    {
                                      type: 'checkbox',
                                      'onUpdate:modelValue': (D) => (L.properties.multiple = D),
                                    },
                                    null,
                                    8,
                                    _hoisted_11$3,
                                  ),
                                  [[vModelCheckbox, L.properties.multiple]],
                                ),
                                Se[5] || (Se[5] = createTextVNode(' Multiple')),
                              ]),
                              createBaseVNode('div', null, [
                                Se[6] || (Se[6] = createBaseVNode('label', null, 'Options:', -1)),
                                (openBlock(!0),
                                createElementBlock(
                                  Fragment,
                                  null,
                                  renderList(
                                    L.properties.options,
                                    (D, Te) => (
                                      openBlock(),
                                      createElementBlock('div', { key: Te }, [
                                        withDirectives(
                                          createBaseVNode(
                                            'input',
                                            {
                                              'onUpdate:modelValue': (K) =>
                                                (L.properties.options[Te] = K),
                                            },
                                            null,
                                            8,
                                            _hoisted_12$2,
                                          ),
                                          [[vModelText, L.properties.options[Te]]],
                                        ),
                                        createBaseVNode(
                                          'button',
                                          { onClick: (K) => L.properties.options.splice(Te, 1) },
                                          'x',
                                          8,
                                          _hoisted_13$1,
                                        ),
                                      ])
                                    ),
                                  ),
                                  128,
                                )),
                                createBaseVNode(
                                  'button',
                                  { onClick: (D) => L.properties.options.push('') },
                                  '+ Add Option',
                                  8,
                                  _hoisted_14$1,
                                ),
                              ]),
                            ]))
                          : createCommentVNode('', !0),
                        L.field_type === 'table'
                          ? (openBlock(),
                            createElementBlock('div', _hoisted_15$1, [
                              Se[11] || (Se[11] = createBaseVNode('label', null, 'Min Rows:', -1)),
                              withDirectives(
                                createBaseVNode(
                                  'input',
                                  {
                                    type: 'number',
                                    'onUpdate:modelValue': (D) => (L.properties.min_rows = D),
                                    min: '0',
                                  },
                                  null,
                                  8,
                                  _hoisted_16$1,
                                ),
                                [[vModelText, L.properties.min_rows, void 0, { number: !0 }]],
                              ),
                              Se[12] || (Se[12] = createBaseVNode('h4', null, 'Table Columns', -1)),
                              (openBlock(!0),
                              createElementBlock(
                                Fragment,
                                null,
                                renderList(
                                  L.properties.columns,
                                  (D, Te) => (
                                    openBlock(),
                                    createElementBlock('div', { key: Te, class: 'table-col' }, [
                                      withDirectives(
                                        createBaseVNode(
                                          'select',
                                          { 'onUpdate:modelValue': (K) => (D.field_type = K) },
                                          [
                                            (openBlock(),
                                            createElementBlock(
                                              Fragment,
                                              null,
                                              renderList(
                                                [
                                                  'text',
                                                  'number',
                                                  'money',
                                                  'date',
                                                  'boolean',
                                                  'dropdown',
                                                  'checkbox',
                                                  'radio',
                                                ],
                                                (K) =>
                                                  createBaseVNode(
                                                    'option',
                                                    { key: K, value: K },
                                                    toDisplayString(K),
                                                    9,
                                                    _hoisted_18$1,
                                                  ),
                                              ),
                                              64,
                                            )),
                                          ],
                                          8,
                                          _hoisted_17$1,
                                        ),
                                        [[vModelSelect, D.field_type]],
                                      ),
                                      withDirectives(
                                        createBaseVNode(
                                          'input',
                                          {
                                            'onUpdate:modelValue': (K) => (D.field_label = K),
                                            placeholder: 'Column Label',
                                          },
                                          null,
                                          8,
                                          _hoisted_19$1,
                                        ),
                                        [[vModelText, D.field_label]],
                                      ),
                                      ['dropdown', 'radio', 'checkbox'].includes(D.field_type)
                                        ? (openBlock(),
                                          createElementBlock('div', _hoisted_20$1, [
                                            Se[7] ||
                                              (Se[7] = createBaseVNode(
                                                'label',
                                                null,
                                                'Options:',
                                                -1,
                                              )),
                                            (openBlock(!0),
                                            createElementBlock(
                                              Fragment,
                                              null,
                                              renderList(
                                                D.properties.options,
                                                (K, De) => (
                                                  openBlock(),
                                                  createElementBlock(
                                                    'div',
                                                    {
                                                      key: De,
                                                      style: {
                                                        display: 'flex',
                                                        gap: '4px',
                                                        'margin-bottom': '2px',
                                                      },
                                                    },
                                                    [
                                                      withDirectives(
                                                        createBaseVNode(
                                                          'input',
                                                          {
                                                            'onUpdate:modelValue': (je) =>
                                                              (D.properties.options[De] = je),
                                                          },
                                                          null,
                                                          8,
                                                          _hoisted_21$1,
                                                        ),
                                                        [[vModelText, D.properties.options[De]]],
                                                      ),
                                                      createBaseVNode(
                                                        'button',
                                                        {
                                                          onClick: withModifiers(
                                                            (je) =>
                                                              D.properties.options.splice(De, 1),
                                                            ['prevent'],
                                                          ),
                                                        },
                                                        'x',
                                                        8,
                                                        _hoisted_22$1,
                                                      ),
                                                    ],
                                                  )
                                                ),
                                              ),
                                              128,
                                            )),
                                            createBaseVNode(
                                              'button',
                                              {
                                                onClick: withModifiers(
                                                  (K) => D.properties.options.push(''),
                                                  ['prevent'],
                                                ),
                                              },
                                              '+ Add Option',
                                              8,
                                              _hoisted_23$1,
                                            ),
                                          ]))
                                        : createCommentVNode('', !0),
                                      createBaseVNode('label', null, [
                                        withDirectives(
                                          createBaseVNode(
                                            'input',
                                            {
                                              type: 'checkbox',
                                              'onUpdate:modelValue': (K) =>
                                                (D.properties.required = K),
                                            },
                                            null,
                                            8,
                                            _hoisted_24$1,
                                          ),
                                          [[vModelCheckbox, D.properties.required]],
                                        ),
                                        Se[8] || (Se[8] = createTextVNode(' Required')),
                                      ]),
                                      createBaseVNode('label', null, [
                                        withDirectives(
                                          createBaseVNode(
                                            'input',
                                            {
                                              type: 'checkbox',
                                              'onUpdate:modelValue': (K) =>
                                                (D.properties.disabled = K),
                                            },
                                            null,
                                            8,
                                            _hoisted_25$1,
                                          ),
                                          [[vModelCheckbox, D.properties.disabled]],
                                        ),
                                        Se[9] || (Se[9] = createTextVNode(' Disabled')),
                                      ]),
                                      createBaseVNode('label', null, [
                                        withDirectives(
                                          createBaseVNode(
                                            'input',
                                            {
                                              type: 'checkbox',
                                              'onUpdate:modelValue': (K) =>
                                                (D.properties.hidden = K),
                                            },
                                            null,
                                            8,
                                            _hoisted_26$1,
                                          ),
                                          [[vModelCheckbox, D.properties.hidden]],
                                        ),
                                        Se[10] || (Se[10] = createTextVNode(' Hidden')),
                                      ]),
                                      createBaseVNode(
                                        'button',
                                        { onClick: (K) => L.properties.columns.splice(Te, 1) },
                                        'Remove',
                                        8,
                                        _hoisted_27$1,
                                      ),
                                    ])
                                  ),
                                ),
                                128,
                              )),
                              createBaseVNode(
                                'button',
                                { onClick: (D) => y(L) },
                                '+ Add Column',
                                8,
                                _hoisted_28$1,
                              ),
                            ]))
                          : createCommentVNode('', !0),
                        createBaseVNode(
                          'button',
                          { onClick: (D) => v(R) },
                          'Remove Field',
                          8,
                          _hoisted_29$1,
                        ),
                        createBaseVNode('div', _hoisted_30$1, [
                          L.field_type !== 'table'
                            ? (openBlock(),
                              createElementBlock(
                                Fragment,
                                { key: 0 },
                                [
                                  createBaseVNode(
                                    'code',
                                    _hoisted_31$1,
                                    toDisplayString(g(L.field_label)),
                                    1,
                                  ),
                                  createBaseVNode(
                                    'button',
                                    {
                                      onClick: (D) => P(g(L.field_label)),
                                      style: { 'margin-left': '8px' },
                                    },
                                    ' Copy ',
                                    8,
                                    _hoisted_32$1,
                                  ),
                                ],
                                64,
                              ))
                            : (openBlock(),
                              createElementBlock(
                                Fragment,
                                { key: 1 },
                                [
                                  createBaseVNode('div', null, [
                                    createBaseVNode(
                                      'table',
                                      {
                                        id: 'table-' + R,
                                        style: {
                                          'border-collapse': 'collapse',
                                          'font-family': 'Arial, sans-serif',
                                          'font-size': '14px',
                                          'margin-bottom': '8px',
                                          width: 'auto',
                                        },
                                      },
                                      [
                                        createBaseVNode('tr', null, [
                                          (openBlock(!0),
                                          createElementBlock(
                                            Fragment,
                                            null,
                                            renderList(
                                              L.properties.columns,
                                              (D) => (
                                                openBlock(),
                                                createElementBlock(
                                                  'th',
                                                  {
                                                    key: D.field_label,
                                                    style: {
                                                      border: '1px solid black',
                                                      padding: '6px',
                                                      'font-family': 'Arial',
                                                    },
                                                  },
                                                  toDisplayString(D.field_label),
                                                  1,
                                                )
                                              ),
                                            ),
                                            128,
                                          )),
                                        ]),
                                        createBaseVNode('tr', null, [
                                          createBaseVNode(
                                            'td',
                                            {
                                              style: {
                                                border: '1px solid black',
                                                padding: '6px',
                                                'font-family': 'Arial',
                                              },
                                              innerHTML: k(L.field_label),
                                            },
                                            null,
                                            8,
                                            _hoisted_34$1,
                                          ),
                                          (openBlock(!0),
                                          createElementBlock(
                                            Fragment,
                                            null,
                                            renderList(
                                              Math.max(0, L.properties.columns.length - 1),
                                              (D, Te) => (
                                                openBlock(),
                                                createElementBlock('td', {
                                                  key: 'for-spacer-' + Te,
                                                  style: {
                                                    border: '1px solid black',
                                                    padding: '6px',
                                                    'font-family': 'Arial',
                                                  },
                                                })
                                              ),
                                            ),
                                            128,
                                          )),
                                        ]),
                                        createBaseVNode('tr', null, [
                                          (openBlock(!0),
                                          createElementBlock(
                                            Fragment,
                                            null,
                                            renderList(
                                              L.properties.columns,
                                              (D) => (
                                                openBlock(),
                                                createElementBlock(
                                                  'td',
                                                  {
                                                    key: D.field_label + '-row',
                                                    style: {
                                                      border: '1px solid black',
                                                      padding: '6px',
                                                      'font-family': 'Arial',
                                                    },
                                                    innerHTML: O(D.field_label),
                                                  },
                                                  null,
                                                  8,
                                                  _hoisted_35$1,
                                                )
                                              ),
                                            ),
                                            128,
                                          )),
                                        ]),
                                        createBaseVNode('tr', null, [
                                          createBaseVNode(
                                            'td',
                                            {
                                              style: {
                                                border: '1px solid black',
                                                padding: '6px',
                                                'font-family': 'Arial',
                                              },
                                              innerHTML: j(),
                                            },
                                            null,
                                            8,
                                            _hoisted_36$1,
                                          ),
                                          (openBlock(!0),
                                          createElementBlock(
                                            Fragment,
                                            null,
                                            renderList(
                                              Math.max(0, L.properties.columns.length - 1),
                                              (D, Te) => (
                                                openBlock(),
                                                createElementBlock('td', {
                                                  key: 'endfor-spacer-' + Te,
                                                  style: {
                                                    border: '1px solid black',
                                                    padding: '6px',
                                                    'font-family': 'Arial',
                                                  },
                                                })
                                              ),
                                            ),
                                            128,
                                          )),
                                        ]),
                                      ],
                                      8,
                                      _hoisted_33$1,
                                    ),
                                  ]),
                                  createBaseVNode(
                                    'button',
                                    { onClick: (D) => F(R), style: { 'margin-top': '4px' } },
                                    'Copy',
                                    8,
                                    _hoisted_37$1,
                                  ),
                                ],
                                64,
                              )),
                        ]),
                        Se[13] || (Se[13] = createBaseVNode('hr', null, null, -1)),
                      ])
                    ),
                  ),
                  128,
                )),
                createBaseVNode('button', { onClick: d }, '+ Add Field'),
                createBaseVNode('div', { style: { 'margin-top': '24px' } }, [
                  createBaseVNode(
                    'button',
                    { onClick: _, style: { 'margin-right': '8px' } },
                    'Submit',
                  ),
                  createBaseVNode('button', { onClick: $ }, 'Cancel'),
                ]),
              ])),
        ])
      )
    },
  },
  DocumentSchema = _export_sfc(_sfc_main$7, [['__scopeId', 'data-v-8e944980']]),
  _hoisted_1$6 = { class: 'filters' },
  _hoisted_2$6 = ['value'],
  _hoisted_3$6 = ['value'],
  _hoisted_4$5 = { class: 'table' },
  _hoisted_5$5 = { style: { float: 'right' } },
  _hoisted_6$5 = { class: 'pagination' },
  _hoisted_7$4 = { class: 'pages' },
  _hoisted_8$4 = ['disabled'],
  _hoisted_9$4 = ['disabled'],
  _sfc_main$6 = {
    __name: 'AuditLogView',
    setup(t) {
      const n = ref([]),
        o = ref([]),
        s = ref([]),
        r = ref(''),
        i = ref(''),
        a = ref('created_at'),
        c = ref('desc'),
        u = ref(1),
        g = ref(10),
        d = ref(0),
        v = localStorage.getItem('token'),
        y = async () => {
          const A = new URLSearchParams({
            page: u.value,
            limit: g.value,
            sort: a.value,
            order: c.value,
          })
          r.value && A.append('username', r.value), i.value && A.append('action_id', i.value)
          const O = await (
            await fetch(`https://api-abealcala.duckdns.org/audit_logs?${A}`, {
              headers: { Authorization: `Bearer ${v}` },
            })
          ).json()
          ;(n.value = O.data), (d.value = O.total), _(O.data)
        }
      function _(A) {
        ;(o.value = [...new Set(A.map((k) => k.username))]),
          (s.value = [...new Set(A.map((k) => k.action_id))])
      }
      function $() {
        ;(c.value = c.value === 'asc' ? 'desc' : 'asc'), (u.value = 1), y()
      }
      return (
        watch([r, i, u, g], y),
        onMounted(y),
        (A, k) => (
          openBlock(),
          createElementBlock('div', null, [
            createBaseVNode('div', _hoisted_1$6, [
              withDirectives(
                createBaseVNode(
                  'select',
                  { 'onUpdate:modelValue': k[0] || (k[0] = (O) => (r.value = O)) },
                  [
                    k[5] || (k[5] = createBaseVNode('option', { value: '' }, 'All Users', -1)),
                    (openBlock(!0),
                    createElementBlock(
                      Fragment,
                      null,
                      renderList(
                        o.value,
                        (O) => (
                          openBlock(),
                          createElementBlock(
                            'option',
                            { key: O, value: O },
                            toDisplayString(O),
                            9,
                            _hoisted_2$6,
                          )
                        ),
                      ),
                      128,
                    )),
                  ],
                  512,
                ),
                [[vModelSelect, r.value]],
              ),
              withDirectives(
                createBaseVNode(
                  'select',
                  { 'onUpdate:modelValue': k[1] || (k[1] = (O) => (i.value = O)) },
                  [
                    k[6] || (k[6] = createBaseVNode('option', { value: '' }, 'All Actions', -1)),
                    (openBlock(!0),
                    createElementBlock(
                      Fragment,
                      null,
                      renderList(
                        s.value,
                        (O) => (
                          openBlock(),
                          createElementBlock(
                            'option',
                            { key: O, value: O },
                            toDisplayString(O),
                            9,
                            _hoisted_3$6,
                          )
                        ),
                      ),
                      128,
                    )),
                  ],
                  512,
                ),
                [[vModelSelect, i.value]],
              ),
            ]),
            createBaseVNode('table', _hoisted_4$5, [
              createBaseVNode('thead', null, [
                createBaseVNode('tr', null, [
                  k[8] || (k[8] = createBaseVNode('th', null, 'Action', -1)),
                  k[9] || (k[9] = createBaseVNode('th', null, 'Metadata', -1)),
                  k[10] || (k[10] = createBaseVNode('th', null, 'User', -1)),
                  createBaseVNode('th', { onClick: $ }, [
                    k[7] || (k[7] = createTextVNode(' Created At ')),
                    createBaseVNode(
                      'span',
                      _hoisted_5$5,
                      toDisplayString(c.value === 'asc' ? '▲' : '▼'),
                      1,
                    ),
                  ]),
                ]),
              ]),
              createBaseVNode('tbody', null, [
                (openBlock(!0),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(
                    n.value,
                    (O) => (
                      openBlock(),
                      createElementBlock('tr', { key: O.id }, [
                        createBaseVNode('td', null, toDisplayString(O.action_id), 1),
                        createBaseVNode('td', null, toDisplayString(O.metadata), 1),
                        createBaseVNode('td', null, toDisplayString(O.username), 1),
                        createBaseVNode(
                          'td',
                          null,
                          toDisplayString(new Date(O.created_at).toLocaleString()),
                          1,
                        ),
                      ])
                    ),
                  ),
                  128,
                )),
              ]),
            ]),
            createBaseVNode('div', _hoisted_6$5, [
              createBaseVNode('label', null, [
                k[12] || (k[12] = createTextVNode(' Per page: ')),
                withDirectives(
                  createBaseVNode(
                    'select',
                    { 'onUpdate:modelValue': k[2] || (k[2] = (O) => (g.value = O)) },
                    k[11] ||
                      (k[11] = [
                        createBaseVNode('option', { value: 5 }, '5', -1),
                        createBaseVNode('option', { value: 10 }, '10', -1),
                        createBaseVNode('option', { value: 20 }, '20', -1),
                      ]),
                    512,
                  ),
                  [[vModelSelect, g.value, void 0, { number: !0 }]],
                ),
              ]),
              createBaseVNode('div', _hoisted_7$4, [
                createBaseVNode(
                  'button',
                  { disabled: u.value === 1, onClick: k[3] || (k[3] = (O) => u.value--) },
                  'Prev',
                  8,
                  _hoisted_8$4,
                ),
                createBaseVNode('span', null, 'Page ' + toDisplayString(u.value), 1),
                createBaseVNode(
                  'button',
                  {
                    disabled: u.value * g.value >= d.value,
                    onClick: k[4] || (k[4] = (O) => u.value++),
                  },
                  'Next',
                  8,
                  _hoisted_9$4,
                ),
              ]),
            ]),
          ])
        )
      )
    },
  },
  AuditLogView = _export_sfc(_sfc_main$6, [['__scopeId', 'data-v-d8aa1222']])
function getDefaultExportFromCjs(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, 'default') ? t.default : t
}
var fuzzysort$2 = { exports: {} },
  fuzzysort$1 = fuzzysort$2.exports,
  hasRequiredFuzzysort
function requireFuzzysort() {
  return (
    hasRequiredFuzzysort ||
      ((hasRequiredFuzzysort = 1),
      (function (t) {
        ;((n, o) => {
          t.exports ? (t.exports = o()) : (n.fuzzysort = o())
        })(fuzzysort$1, (n) => {
          var o = (Ue, Ae) => {
              if (!Ue || !Ae) return it
              var We = $(Ue)
              xe(Ae) || (Ae = _(Ae))
              var z = We.bitflags
              return (z & Ae._bitflags) !== z ? it : k(We, Ae)
            },
            s = (Ue, Ae, We) => {
              if (!Ue) return We?.all ? A(Ae, We) : rt
              var z = $(Ue),
                Re = z.bitflags,
                ke = z.containsSpace,
                Ee = v(We?.threshold || 0),
                Ye = We?.limit || Ze,
                Ge = 0,
                b = 0,
                w = Ae.length
              function Ve(at) {
                Ge < Ye
                  ? (ht.add(at), ++Ge)
                  : (++b, at._score > ht.peek()._score && ht.replaceTop(at))
              }
              if (We?.key)
                for (var $e = We.key, Ne = 0; Ne < w; ++Ne) {
                  var Me = Ae[Ne],
                    He = Pe(Me, $e)
                  if (He && (xe(He) || (He = _(He)), (Re & He._bitflags) === Re)) {
                    var Ie = k(z, He)
                    Ie !== it && (Ie._score < Ee || ((Ie.obj = Me), Ve(Ie)))
                  }
                }
              else if (We?.keys) {
                var ze = We.keys,
                  Fe = ze.length
                e: for (var Ne = 0; Ne < w; ++Ne) {
                  var Me = Ae[Ne]
                  {
                    for (var Qe = 0, Le = 0; Le < Fe; ++Le) {
                      var $e = ze[Le],
                        He = Pe(Me, $e)
                      if (!He) {
                        De[Le] = ct
                        continue
                      }
                      xe(He) || (He = _(He)), (De[Le] = He), (Qe |= He._bitflags)
                    }
                    if ((Re & Qe) !== Re) continue
                  }
                  if (ke) for (let nt = 0; nt < z.spaceSearches.length; nt++) Te[nt] = Ke
                  for (var Le = 0; Le < Fe; ++Le) {
                    if (((He = De[Le]), He === ct)) {
                      je[Le] = ct
                      continue
                    }
                    if (((je[Le] = k(z, He, !1, ke)), je[Le] === it)) {
                      je[Le] = ct
                      continue
                    }
                    if (ke)
                      for (let ot = 0; ot < z.spaceSearches.length; ot++) {
                        if (K[ot] > -1e3 && Te[ot] > Ke) {
                          var Je = (Te[ot] + K[ot]) / 4
                          Je > Te[ot] && (Te[ot] = Je)
                        }
                        K[ot] > Te[ot] && (Te[ot] = K[ot])
                      }
                  }
                  if (ke) {
                    for (let nt = 0; nt < z.spaceSearches.length; nt++)
                      if (Te[nt] === Ke) continue e
                  } else {
                    var qe = !1
                    for (let nt = 0; nt < Fe; nt++)
                      if (je[nt]._score !== Ke) {
                        qe = !0
                        break
                      }
                    if (!qe) continue
                  }
                  var Xe = new u(Fe)
                  for (let nt = 0; nt < Fe; nt++) Xe[nt] = je[nt]
                  if (ke) {
                    var et = 0
                    for (let nt = 0; nt < z.spaceSearches.length; nt++) et += Te[nt]
                  } else {
                    var et = Ke
                    for (let ot = 0; ot < Fe; ot++) {
                      var Ie = Xe[ot]
                      if (Ie._score > -1e3 && et > Ke) {
                        var Je = (et + Ie._score) / 4
                        Je > et && (et = Je)
                      }
                      Ie._score > et && (et = Ie._score)
                    }
                  }
                  if (((Xe.obj = Me), (Xe._score = et), We?.scoreFn)) {
                    if (((et = We.scoreFn(Xe)), !et)) continue
                    ;(et = v(et)), (Xe._score = et)
                  }
                  et < Ee || Ve(Xe)
                }
              } else
                for (var Ne = 0; Ne < w; ++Ne) {
                  var He = Ae[Ne]
                  if (He && (xe(He) || (He = _(He)), (Re & He._bitflags) === Re)) {
                    var Ie = k(z, He)
                    Ie !== it && (Ie._score < Ee || Ve(Ie))
                  }
                }
              if (Ge === 0) return rt
              for (var st = new Array(Ge), Ne = Ge - 1; Ne >= 0; --Ne) st[Ne] = ht.poll()
              return (st.total = Ge + b), st
            },
            r = (Ue, Ae = '<b>', We = '</b>') => {
              for (
                var z = typeof Ae == 'function' ? Ae : void 0,
                  Re = Ue.target,
                  ke = Re.length,
                  Ee = Ue.indexes,
                  Ye = '',
                  Ge = 0,
                  b = 0,
                  w = !1,
                  Ve = [],
                  $e = 0;
                $e < ke;
                ++$e
              ) {
                var Ne = Re[$e]
                if (Ee[b] === $e) {
                  if (
                    (++b,
                    w || ((w = !0), z ? (Ve.push(Ye), (Ye = '')) : (Ye += Ae)),
                    b === Ee.length)
                  ) {
                    z
                      ? ((Ye += Ne), Ve.push(z(Ye, Ge++)), (Ye = ''), Ve.push(Re.substr($e + 1)))
                      : (Ye += Ne + We + Re.substr($e + 1))
                    break
                  }
                } else w && ((w = !1), z ? (Ve.push(z(Ye, Ge++)), (Ye = '')) : (Ye += We))
                Ye += Ne
              }
              return z ? Ve : Ye
            },
            i = (Ue) => {
              typeof Ue == 'number' ? (Ue = '' + Ue) : typeof Ue != 'string' && (Ue = '')
              var Ae = B(Ue)
              return g(Ue, {
                _targetLower: Ae._lower,
                _targetLowerCodes: Ae.lowerCodes,
                _bitflags: Ae.bitflags,
              })
            },
            a = () => {
              Be.clear(), Se.clear()
            }
          class c {
            get indexes() {
              return this._indexes.slice(0, this._indexes.len).sort((Ae, We) => Ae - We)
            }
            set indexes(Ae) {
              return (this._indexes = Ae)
            }
            highlight(Ae, We) {
              return r(this, Ae, We)
            }
            get score() {
              return d(this._score)
            }
            set score(Ae) {
              this._score = v(Ae)
            }
          }
          class u extends Array {
            get score() {
              return d(this._score)
            }
            set score(Ae) {
              this._score = v(Ae)
            }
          }
          var g = (Ue, Ae) => {
              const We = new c()
              return (
                (We.target = Ue),
                (We.obj = Ae.obj ?? it),
                (We._score = Ae._score ?? Ke),
                (We._indexes = Ae._indexes ?? []),
                (We._targetLower = Ae._targetLower ?? ''),
                (We._targetLowerCodes = Ae._targetLowerCodes ?? it),
                (We._nextBeginningIndexes = Ae._nextBeginningIndexes ?? it),
                (We._bitflags = Ae._bitflags ?? 0),
                We
              )
            },
            d = (Ue) => (Ue === Ke ? 0 : Ue > 1 ? Ue : Math.E ** (((-Ue + 1) ** 0.04307 - 1) * -2)),
            v = (Ue) =>
              Ue === 0 ? Ke : Ue > 1 ? Ue : 1 - Math.pow(Math.log(Ue) / -2 + 1, 1 / 0.04307),
            y = (Ue) => {
              typeof Ue == 'number' ? (Ue = '' + Ue) : typeof Ue != 'string' && (Ue = ''),
                (Ue = Ue.trim())
              var Ae = B(Ue),
                We = []
              if (Ae.containsSpace) {
                var z = Ue.split(/\s+/)
                z = [...new Set(z)]
                for (var Re = 0; Re < z.length; Re++)
                  if (z[Re] !== '') {
                    var ke = B(z[Re])
                    We.push({
                      lowerCodes: ke.lowerCodes,
                      _lower: z[Re].toLowerCase(),
                      containsSpace: !1,
                    })
                  }
              }
              return {
                lowerCodes: Ae.lowerCodes,
                _lower: Ae._lower,
                containsSpace: Ae.containsSpace,
                bitflags: Ae.bitflags,
                spaceSearches: We,
              }
            },
            _ = (Ue) => {
              if (Ue.length > 999) return i(Ue)
              var Ae = Be.get(Ue)
              return Ae !== void 0 || ((Ae = i(Ue)), Be.set(Ue, Ae)), Ae
            },
            $ = (Ue) => {
              if (Ue.length > 999) return y(Ue)
              var Ae = Se.get(Ue)
              return Ae !== void 0 || ((Ae = y(Ue)), Se.set(Ue, Ae)), Ae
            },
            A = (Ue, Ae) => {
              var We = []
              We.total = Ue.length
              var z = Ae?.limit || Ze
              if (Ae?.key)
                for (var Re = 0; Re < Ue.length; Re++) {
                  var ke = Ue[Re],
                    Ee = Pe(ke, Ae.key)
                  if (Ee != it) {
                    xe(Ee) || (Ee = _(Ee))
                    var Ye = g(Ee.target, { _score: Ee._score, obj: ke })
                    if ((We.push(Ye), We.length >= z)) return We
                  }
                }
              else if (Ae?.keys)
                for (var Re = 0; Re < Ue.length; Re++) {
                  for (
                    var ke = Ue[Re], Ge = new u(Ae.keys.length), b = Ae.keys.length - 1;
                    b >= 0;
                    --b
                  ) {
                    var Ee = Pe(ke, Ae.keys[b])
                    if (!Ee) {
                      Ge[b] = ct
                      continue
                    }
                    xe(Ee) || (Ee = _(Ee)), (Ee._score = Ke), (Ee._indexes.len = 0), (Ge[b] = Ee)
                  }
                  if (((Ge.obj = ke), (Ge._score = Ke), We.push(Ge), We.length >= z)) return We
                }
              else
                for (var Re = 0; Re < Ue.length; Re++) {
                  var Ee = Ue[Re]
                  if (
                    Ee != it &&
                    (xe(Ee) || (Ee = _(Ee)),
                    (Ee._score = Ke),
                    (Ee._indexes.len = 0),
                    We.push(Ee),
                    We.length >= z)
                  )
                    return We
                }
              return We
            },
            k = (Ue, Ae, We = !1, z = !1) => {
              if (We === !1 && Ue.containsSpace) return O(Ue, Ae, z)
              for (
                var Re = Ue._lower,
                  ke = Ue.lowerCodes,
                  Ee = ke[0],
                  Ye = Ae._targetLowerCodes,
                  Ge = ke.length,
                  b = Ye.length,
                  Ne = 0,
                  w = 0,
                  Ve = 0;
                ;

              ) {
                var $e = Ee === Ye[w]
                if ($e) {
                  if (((L[Ve++] = w), ++Ne, Ne === Ge)) break
                  Ee = ke[Ne]
                }
                if ((++w, w >= b)) return it
              }
              var Ne = 0,
                Me = !1,
                He = 0,
                Ie = Ae._nextBeginningIndexes
              Ie === it && (Ie = Ae._nextBeginningIndexes = F(Ae.target)),
                (w = L[0] === 0 ? 0 : Ie[L[0] - 1])
              var ze = 0
              if (w !== b)
                for (;;)
                  if (w >= b) {
                    if (Ne <= 0 || (++ze, ze > 200)) break
                    --Ne
                    var Fe = R[--He]
                    w = Ie[Fe]
                  } else {
                    var $e = ke[Ne] === Ye[w]
                    if ($e) {
                      if (((R[He++] = w), ++Ne, Ne === Ge)) {
                        Me = !0
                        break
                      }
                      ++w
                    } else w = Ie[w]
                  }
              var Qe = Ge <= 1 ? -1 : Ae._targetLower.indexOf(Re, L[0]),
                Le = !!~Qe,
                Je = Le ? Qe === 0 || Ae._nextBeginningIndexes[Qe - 1] === Qe : !1
              if (Le && !Je) {
                for (var qe = 0; qe < Ie.length; qe = Ie[qe])
                  if (!(qe <= Qe)) {
                    for (var Xe = 0; Xe < Ge && ke[Xe] === Ae._targetLowerCodes[qe + Xe]; Xe++);
                    if (Xe === Ge) {
                      ;(Qe = qe), (Je = !0)
                      break
                    }
                  }
              }
              var et = (nt) => {
                for (var ot = 0, mt = 0, pt = 1; pt < Ge; ++pt)
                  nt[pt] - nt[pt - 1] !== 1 && ((ot -= nt[pt]), ++mt)
                var dt = nt[Ge - 1] - nt[0] - (Ge - 1)
                if (((ot -= (12 + dt) * mt), nt[0] !== 0 && (ot -= nt[0] * nt[0] * 0.2), !Me))
                  ot *= 1e3
                else {
                  for (var ft = 1, pt = Ie[0]; pt < b; pt = Ie[pt]) ++ft
                  ft > 24 && (ot *= (ft - 24) * 10)
                }
                return (
                  (ot -= (b - Ge) / 2),
                  Le && (ot /= 1 + Ge * Ge * 1),
                  Je && (ot /= 1 + Ge * Ge * 1),
                  (ot -= (b - Ge) / 2),
                  ot
                )
              }
              if (Me)
                if (Je) {
                  for (var qe = 0; qe < Ge; ++qe) L[qe] = Qe + qe
                  var st = L,
                    at = et(L)
                } else
                  var st = R,
                    at = et(R)
              else {
                if (Le) for (var qe = 0; qe < Ge; ++qe) L[qe] = Qe + qe
                var st = L,
                  at = et(st)
              }
              Ae._score = at
              for (var qe = 0; qe < Ge; ++qe) Ae._indexes[qe] = st[qe]
              Ae._indexes.len = Ge
              const lt = new c()
              return (
                (lt.target = Ae.target), (lt._score = Ae._score), (lt._indexes = Ae._indexes), lt
              )
            },
            O = (Ue, Ae, We) => {
              for (
                var z = new Set(),
                  Re = 0,
                  ke = it,
                  Ee = 0,
                  Ye = Ue.spaceSearches,
                  Ge = Ye.length,
                  b = 0,
                  w = () => {
                    for (let Je = b - 1; Je >= 0; Je--)
                      Ae._nextBeginningIndexes[D[Je * 2 + 0]] = D[Je * 2 + 1]
                  },
                  Ve = !1,
                  Le = 0;
                Le < Ge;
                ++Le
              ) {
                K[Le] = Ke
                var $e = Ye[Le]
                if (((ke = k($e, Ae)), We)) {
                  if (ke === it) continue
                  Ve = !0
                } else if (ke === it) return w(), it
                var Ne = Le === Ge - 1
                if (!Ne) {
                  var Me = ke._indexes,
                    He = !0
                  for (let qe = 0; qe < Me.len - 1; qe++)
                    if (Me[qe + 1] - Me[qe] !== 1) {
                      He = !1
                      break
                    }
                  if (He) {
                    var Ie = Me[Me.len - 1] + 1,
                      ze = Ae._nextBeginningIndexes[Ie - 1]
                    for (let qe = Ie - 1; qe >= 0 && ze === Ae._nextBeginningIndexes[qe]; qe--)
                      (Ae._nextBeginningIndexes[qe] = Ie),
                        (D[b * 2 + 0] = qe),
                        (D[b * 2 + 1] = ze),
                        b++
                  }
                }
                ;(Re += ke._score / Ge),
                  (K[Le] = ke._score / Ge),
                  ke._indexes[0] < Ee && (Re -= (Ee - ke._indexes[0]) * 2),
                  (Ee = ke._indexes[0])
                for (var Fe = 0; Fe < ke._indexes.len; ++Fe) z.add(ke._indexes[Fe])
              }
              if (We && !Ve) return it
              w()
              var Qe = k(Ue, Ae, !0)
              if (Qe !== it && Qe._score > Re) {
                if (We) for (var Le = 0; Le < Ge; ++Le) K[Le] = Qe._score / Ge
                return Qe
              }
              We && (ke = Ae), (ke._score = Re)
              var Le = 0
              for (let Je of z) ke._indexes[Le++] = Je
              return (ke._indexes.len = Le), ke
            },
            j = (Ue) =>
              Ue.replace(new RegExp('\\p{Script=Latin}+', 'gu'), (Ae) =>
                Ae.normalize('NFD'),
              ).replace(/[\u0300-\u036f]/g, ''),
            B = (Ue) => {
              Ue = j(Ue)
              for (
                var Ae = Ue.length, We = Ue.toLowerCase(), z = [], Re = 0, ke = !1, Ee = 0;
                Ee < Ae;
                ++Ee
              ) {
                var Ye = (z[Ee] = We.charCodeAt(Ee))
                if (Ye === 32) {
                  ke = !0
                  continue
                }
                var Ge =
                  Ye >= 97 && Ye <= 122 ? Ye - 97 : Ye >= 48 && Ye <= 57 ? 26 : Ye <= 127 ? 30 : 31
                Re |= 1 << Ge
              }
              return { lowerCodes: z, bitflags: Re, containsSpace: ke, _lower: We }
            },
            P = (Ue) => {
              for (var Ae = Ue.length, We = [], z = 0, Re = !1, ke = !1, Ee = 0; Ee < Ae; ++Ee) {
                var Ye = Ue.charCodeAt(Ee),
                  Ge = Ye >= 65 && Ye <= 90,
                  b = Ge || (Ye >= 97 && Ye <= 122) || (Ye >= 48 && Ye <= 57),
                  w = (Ge && !Re) || !ke || !b
                ;(Re = Ge), (ke = b), w && (We[z++] = Ee)
              }
              return We
            },
            F = (Ue) => {
              Ue = j(Ue)
              for (
                var Ae = Ue.length, We = P(Ue), z = [], Re = We[0], ke = 0, Ee = 0;
                Ee < Ae;
                ++Ee
              )
                Re > Ee ? (z[Ee] = Re) : ((Re = We[++ke]), (z[Ee] = Re === void 0 ? Ae : Re))
              return z
            },
            Be = new Map(),
            Se = new Map(),
            L = [],
            R = [],
            D = [],
            Te = [],
            K = [],
            De = [],
            je = [],
            Pe = (Ue, Ae) => {
              var We = Ue[Ae]
              if (We !== void 0) return We
              if (typeof Ae == 'function') return Ae(Ue)
              var z = Ae
              Array.isArray(Ae) || (z = Ae.split('.'))
              for (var Re = z.length, ke = -1; Ue && ++ke < Re; ) Ue = Ue[z[ke]]
              return Ue
            },
            xe = (Ue) => typeof Ue == 'object' && typeof Ue._bitflags == 'number',
            Ze = 1 / 0,
            Ke = -Ze,
            rt = []
          rt.total = 0
          var it = null,
            ct = i(''),
            ut = (Ue) => {
              var Ae = [],
                We = 0,
                z = {},
                Re = (ke) => {
                  for (var Ee = 0, Ye = Ae[Ee], Ge = 1; Ge < We; ) {
                    var b = Ge + 1
                    ;(Ee = Ge),
                      b < We && Ae[b]._score < Ae[Ge]._score && (Ee = b),
                      (Ae[(Ee - 1) >> 1] = Ae[Ee]),
                      (Ge = 1 + (Ee << 1))
                  }
                  for (
                    var w = (Ee - 1) >> 1;
                    Ee > 0 && Ye._score < Ae[w]._score;
                    w = ((Ee = w) - 1) >> 1
                  )
                    Ae[Ee] = Ae[w]
                  Ae[Ee] = Ye
                }
              return (
                (z.add = (ke) => {
                  var Ee = We
                  Ae[We++] = ke
                  for (
                    var Ye = (Ee - 1) >> 1;
                    Ee > 0 && ke._score < Ae[Ye]._score;
                    Ye = ((Ee = Ye) - 1) >> 1
                  )
                    Ae[Ee] = Ae[Ye]
                  Ae[Ee] = ke
                }),
                (z.poll = (ke) => {
                  if (We !== 0) {
                    var Ee = Ae[0]
                    return (Ae[0] = Ae[--We]), Re(), Ee
                  }
                }),
                (z.peek = (ke) => {
                  if (We !== 0) return Ae[0]
                }),
                (z.replaceTop = (ke) => {
                  ;(Ae[0] = ke), Re()
                }),
                z
              )
            },
            ht = ut()
          return { single: o, go: s, prepare: i, cleanup: a }
        })
      })(fuzzysort$2)),
    fuzzysort$2.exports
  )
}
var fuzzysortExports = requireFuzzysort()
const fuzzysort = getDefaultExportFromCjs(fuzzysortExports),
  min = Math.min,
  max = Math.max,
  round = Math.round,
  floor = Math.floor,
  createCoords = (t) => ({ x: t, y: t }),
  oppositeSideMap = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' },
  oppositeAlignmentMap = { start: 'end', end: 'start' }
function clamp(t, n, o) {
  return max(t, min(n, o))
}
function evaluate(t, n) {
  return typeof t == 'function' ? t(n) : t
}
function getSide(t) {
  return t.split('-')[0]
}
function getAlignment(t) {
  return t.split('-')[1]
}
function getOppositeAxis(t) {
  return t === 'x' ? 'y' : 'x'
}
function getAxisLength(t) {
  return t === 'y' ? 'height' : 'width'
}
const yAxisSides = new Set(['top', 'bottom'])
function getSideAxis(t) {
  return yAxisSides.has(getSide(t)) ? 'y' : 'x'
}
function getAlignmentAxis(t) {
  return getOppositeAxis(getSideAxis(t))
}
function getAlignmentSides(t, n, o) {
  o === void 0 && (o = !1)
  const s = getAlignment(t),
    r = getAlignmentAxis(t),
    i = getAxisLength(r)
  let a =
    r === 'x' ? (s === (o ? 'end' : 'start') ? 'right' : 'left') : s === 'start' ? 'bottom' : 'top'
  return (
    n.reference[i] > n.floating[i] && (a = getOppositePlacement(a)), [a, getOppositePlacement(a)]
  )
}
function getExpandedPlacements(t) {
  const n = getOppositePlacement(t)
  return [getOppositeAlignmentPlacement(t), n, getOppositeAlignmentPlacement(n)]
}
function getOppositeAlignmentPlacement(t) {
  return t.replace(/start|end/g, (n) => oppositeAlignmentMap[n])
}
const lrPlacement = ['left', 'right'],
  rlPlacement = ['right', 'left'],
  tbPlacement = ['top', 'bottom'],
  btPlacement = ['bottom', 'top']
function getSideList(t, n, o) {
  switch (t) {
    case 'top':
    case 'bottom':
      return o ? (n ? rlPlacement : lrPlacement) : n ? lrPlacement : rlPlacement
    case 'left':
    case 'right':
      return n ? tbPlacement : btPlacement
    default:
      return []
  }
}
function getOppositeAxisPlacements(t, n, o, s) {
  const r = getAlignment(t)
  let i = getSideList(getSide(t), o === 'start', s)
  return (
    r &&
      ((i = i.map((a) => a + '-' + r)), n && (i = i.concat(i.map(getOppositeAlignmentPlacement)))),
    i
  )
}
function getOppositePlacement(t) {
  return t.replace(/left|right|bottom|top/g, (n) => oppositeSideMap[n])
}
function expandPaddingObject(t) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...t }
}
function getPaddingObject(t) {
  return typeof t != 'number' ? expandPaddingObject(t) : { top: t, right: t, bottom: t, left: t }
}
function rectToClientRect(t) {
  const { x: n, y: o, width: s, height: r } = t
  return { width: s, height: r, top: o, left: n, right: n + s, bottom: o + r, x: n, y: o }
}
function computeCoordsFromPlacement(t, n, o) {
  let { reference: s, floating: r } = t
  const i = getSideAxis(n),
    a = getAlignmentAxis(n),
    c = getAxisLength(a),
    u = getSide(n),
    g = i === 'y',
    d = s.x + s.width / 2 - r.width / 2,
    v = s.y + s.height / 2 - r.height / 2,
    y = s[c] / 2 - r[c] / 2
  let _
  switch (u) {
    case 'top':
      _ = { x: d, y: s.y - r.height }
      break
    case 'bottom':
      _ = { x: d, y: s.y + s.height }
      break
    case 'right':
      _ = { x: s.x + s.width, y: v }
      break
    case 'left':
      _ = { x: s.x - r.width, y: v }
      break
    default:
      _ = { x: s.x, y: s.y }
  }
  switch (getAlignment(n)) {
    case 'start':
      _[a] -= y * (o && g ? -1 : 1)
      break
    case 'end':
      _[a] += y * (o && g ? -1 : 1)
      break
  }
  return _
}
const computePosition$1 = async (t, n, o) => {
  const { placement: s = 'bottom', strategy: r = 'absolute', middleware: i = [], platform: a } = o,
    c = i.filter(Boolean),
    u = await (a.isRTL == null ? void 0 : a.isRTL(n))
  let g = await a.getElementRects({ reference: t, floating: n, strategy: r }),
    { x: d, y: v } = computeCoordsFromPlacement(g, s, u),
    y = s,
    _ = {},
    $ = 0
  for (let A = 0; A < c.length; A++) {
    const { name: k, fn: O } = c[A],
      {
        x: j,
        y: B,
        data: P,
        reset: F,
      } = await O({
        x: d,
        y: v,
        initialPlacement: s,
        placement: y,
        strategy: r,
        middlewareData: _,
        rects: g,
        platform: a,
        elements: { reference: t, floating: n },
      })
    ;(d = j ?? d),
      (v = B ?? v),
      (_ = { ..._, [k]: { ..._[k], ...P } }),
      F &&
        $ <= 50 &&
        ($++,
        typeof F == 'object' &&
          (F.placement && (y = F.placement),
          F.rects &&
            (g =
              F.rects === !0
                ? await a.getElementRects({ reference: t, floating: n, strategy: r })
                : F.rects),
          ({ x: d, y: v } = computeCoordsFromPlacement(g, y, u))),
        (A = -1))
  }
  return { x: d, y: v, placement: y, strategy: r, middlewareData: _ }
}
async function detectOverflow(t, n) {
  var o
  n === void 0 && (n = {})
  const { x: s, y: r, platform: i, rects: a, elements: c, strategy: u } = t,
    {
      boundary: g = 'clippingAncestors',
      rootBoundary: d = 'viewport',
      elementContext: v = 'floating',
      altBoundary: y = !1,
      padding: _ = 0,
    } = evaluate(n, t),
    $ = getPaddingObject(_),
    k = c[y ? (v === 'floating' ? 'reference' : 'floating') : v],
    O = rectToClientRect(
      await i.getClippingRect({
        element:
          (o = await (i.isElement == null ? void 0 : i.isElement(k))) == null || o
            ? k
            : k.contextElement ||
              (await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(c.floating))),
        boundary: g,
        rootBoundary: d,
        strategy: u,
      }),
    ),
    j =
      v === 'floating'
        ? { x: s, y: r, width: a.floating.width, height: a.floating.height }
        : a.reference,
    B = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(c.floating)),
    P = (await (i.isElement == null ? void 0 : i.isElement(B)))
      ? (await (i.getScale == null ? void 0 : i.getScale(B))) || { x: 1, y: 1 }
      : { x: 1, y: 1 },
    F = rectToClientRect(
      i.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: c,
            rect: j,
            offsetParent: B,
            strategy: u,
          })
        : j,
    )
  return {
    top: (O.top - F.top + $.top) / P.y,
    bottom: (F.bottom - O.bottom + $.bottom) / P.y,
    left: (O.left - F.left + $.left) / P.x,
    right: (F.right - O.right + $.right) / P.x,
  }
}
const flip$1 = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: 'flip',
        options: t,
        async fn(n) {
          var o, s
          const {
              placement: r,
              middlewareData: i,
              rects: a,
              initialPlacement: c,
              platform: u,
              elements: g,
            } = n,
            {
              mainAxis: d = !0,
              crossAxis: v = !0,
              fallbackPlacements: y,
              fallbackStrategy: _ = 'bestFit',
              fallbackAxisSideDirection: $ = 'none',
              flipAlignment: A = !0,
              ...k
            } = evaluate(t, n)
          if ((o = i.arrow) != null && o.alignmentOffset) return {}
          const O = getSide(r),
            j = getSideAxis(c),
            B = getSide(c) === c,
            P = await (u.isRTL == null ? void 0 : u.isRTL(g.floating)),
            F = y || (B || !A ? [getOppositePlacement(c)] : getExpandedPlacements(c)),
            Be = $ !== 'none'
          !y && Be && F.push(...getOppositeAxisPlacements(c, A, $, P))
          const Se = [c, ...F],
            L = await detectOverflow(n, k),
            R = []
          let D = ((s = i.flip) == null ? void 0 : s.overflows) || []
          if ((d && R.push(L[O]), v)) {
            const je = getAlignmentSides(r, a, P)
            R.push(L[je[0]], L[je[1]])
          }
          if (((D = [...D, { placement: r, overflows: R }]), !R.every((je) => je <= 0))) {
            var Te, K
            const je = (((Te = i.flip) == null ? void 0 : Te.index) || 0) + 1,
              Pe = Se[je]
            if (
              Pe &&
              (!(v === 'alignment' ? j !== getSideAxis(Pe) : !1) ||
                D.every((Ke) => Ke.overflows[0] > 0 && getSideAxis(Ke.placement) === j))
            )
              return { data: { index: je, overflows: D }, reset: { placement: Pe } }
            let xe =
              (K = D.filter((Ze) => Ze.overflows[0] <= 0).sort(
                (Ze, Ke) => Ze.overflows[1] - Ke.overflows[1],
              )[0]) == null
                ? void 0
                : K.placement
            if (!xe)
              switch (_) {
                case 'bestFit': {
                  var De
                  const Ze =
                    (De = D.filter((Ke) => {
                      if (Be) {
                        const rt = getSideAxis(Ke.placement)
                        return rt === j || rt === 'y'
                      }
                      return !0
                    })
                      .map((Ke) => [
                        Ke.placement,
                        Ke.overflows.filter((rt) => rt > 0).reduce((rt, it) => rt + it, 0),
                      ])
                      .sort((Ke, rt) => Ke[1] - rt[1])[0]) == null
                      ? void 0
                      : De[0]
                  Ze && (xe = Ze)
                  break
                }
                case 'initialPlacement':
                  xe = c
                  break
              }
            if (r !== xe) return { reset: { placement: xe } }
          }
          return {}
        },
      }
    )
  },
  originSides = new Set(['left', 'top'])
async function convertValueToCoords(t, n) {
  const { placement: o, platform: s, elements: r } = t,
    i = await (s.isRTL == null ? void 0 : s.isRTL(r.floating)),
    a = getSide(o),
    c = getAlignment(o),
    u = getSideAxis(o) === 'y',
    g = originSides.has(a) ? -1 : 1,
    d = i && u ? -1 : 1,
    v = evaluate(n, t)
  let {
    mainAxis: y,
    crossAxis: _,
    alignmentAxis: $,
  } = typeof v == 'number'
    ? { mainAxis: v, crossAxis: 0, alignmentAxis: null }
    : { mainAxis: v.mainAxis || 0, crossAxis: v.crossAxis || 0, alignmentAxis: v.alignmentAxis }
  return (
    c && typeof $ == 'number' && (_ = c === 'end' ? $ * -1 : $),
    u ? { x: _ * d, y: y * g } : { x: y * g, y: _ * d }
  )
}
const offset$1 = function (t) {
    return (
      t === void 0 && (t = 0),
      {
        name: 'offset',
        options: t,
        async fn(n) {
          var o, s
          const { x: r, y: i, placement: a, middlewareData: c } = n,
            u = await convertValueToCoords(n, t)
          return a === ((o = c.offset) == null ? void 0 : o.placement) &&
            (s = c.arrow) != null &&
            s.alignmentOffset
            ? {}
            : { x: r + u.x, y: i + u.y, data: { ...u, placement: a } }
        },
      }
    )
  },
  shift$1 = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: 'shift',
        options: t,
        async fn(n) {
          const { x: o, y: s, placement: r } = n,
            {
              mainAxis: i = !0,
              crossAxis: a = !1,
              limiter: c = {
                fn: (k) => {
                  let { x: O, y: j } = k
                  return { x: O, y: j }
                },
              },
              ...u
            } = evaluate(t, n),
            g = { x: o, y: s },
            d = await detectOverflow(n, u),
            v = getSideAxis(getSide(r)),
            y = getOppositeAxis(v)
          let _ = g[y],
            $ = g[v]
          if (i) {
            const k = y === 'y' ? 'top' : 'left',
              O = y === 'y' ? 'bottom' : 'right',
              j = _ + d[k],
              B = _ - d[O]
            _ = clamp(j, _, B)
          }
          if (a) {
            const k = v === 'y' ? 'top' : 'left',
              O = v === 'y' ? 'bottom' : 'right',
              j = $ + d[k],
              B = $ - d[O]
            $ = clamp(j, $, B)
          }
          const A = c.fn({ ...n, [y]: _, [v]: $ })
          return { ...A, data: { x: A.x - o, y: A.y - s, enabled: { [y]: i, [v]: a } } }
        },
      }
    )
  }
function hasWindow() {
  return typeof window < 'u'
}
function getNodeName(t) {
  return isNode(t) ? (t.nodeName || '').toLowerCase() : '#document'
}
function getWindow(t) {
  var n
  return (t == null || (n = t.ownerDocument) == null ? void 0 : n.defaultView) || window
}
function getDocumentElement(t) {
  var n
  return (n = (isNode(t) ? t.ownerDocument : t.document) || window.document) == null
    ? void 0
    : n.documentElement
}
function isNode(t) {
  return hasWindow() ? t instanceof Node || t instanceof getWindow(t).Node : !1
}
function isElement(t) {
  return hasWindow() ? t instanceof Element || t instanceof getWindow(t).Element : !1
}
function isHTMLElement(t) {
  return hasWindow() ? t instanceof HTMLElement || t instanceof getWindow(t).HTMLElement : !1
}
function isShadowRoot(t) {
  return !hasWindow() || typeof ShadowRoot > 'u'
    ? !1
    : t instanceof ShadowRoot || t instanceof getWindow(t).ShadowRoot
}
const invalidOverflowDisplayValues = new Set(['inline', 'contents'])
function isOverflowElement(t) {
  const { overflow: n, overflowX: o, overflowY: s, display: r } = getComputedStyle(t)
  return /auto|scroll|overlay|hidden|clip/.test(n + s + o) && !invalidOverflowDisplayValues.has(r)
}
const tableElements = new Set(['table', 'td', 'th'])
function isTableElement(t) {
  return tableElements.has(getNodeName(t))
}
const topLayerSelectors = [':popover-open', ':modal']
function isTopLayer(t) {
  return topLayerSelectors.some((n) => {
    try {
      return t.matches(n)
    } catch {
      return !1
    }
  })
}
const transformProperties = ['transform', 'translate', 'scale', 'rotate', 'perspective'],
  willChangeValues = ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'],
  containValues = ['paint', 'layout', 'strict', 'content']
function isContainingBlock(t) {
  const n = isWebKit(),
    o = isElement(t) ? getComputedStyle(t) : t
  return (
    transformProperties.some((s) => (o[s] ? o[s] !== 'none' : !1)) ||
    (o.containerType ? o.containerType !== 'normal' : !1) ||
    (!n && (o.backdropFilter ? o.backdropFilter !== 'none' : !1)) ||
    (!n && (o.filter ? o.filter !== 'none' : !1)) ||
    willChangeValues.some((s) => (o.willChange || '').includes(s)) ||
    containValues.some((s) => (o.contain || '').includes(s))
  )
}
function getContainingBlock(t) {
  let n = getParentNode(t)
  for (; isHTMLElement(n) && !isLastTraversableNode(n); ) {
    if (isContainingBlock(n)) return n
    if (isTopLayer(n)) return null
    n = getParentNode(n)
  }
  return null
}
function isWebKit() {
  return typeof CSS > 'u' || !CSS.supports ? !1 : CSS.supports('-webkit-backdrop-filter', 'none')
}
const lastTraversableNodeNames = new Set(['html', 'body', '#document'])
function isLastTraversableNode(t) {
  return lastTraversableNodeNames.has(getNodeName(t))
}
function getComputedStyle(t) {
  return getWindow(t).getComputedStyle(t)
}
function getNodeScroll(t) {
  return isElement(t)
    ? { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop }
    : { scrollLeft: t.scrollX, scrollTop: t.scrollY }
}
function getParentNode(t) {
  if (getNodeName(t) === 'html') return t
  const n = t.assignedSlot || t.parentNode || (isShadowRoot(t) && t.host) || getDocumentElement(t)
  return isShadowRoot(n) ? n.host : n
}
function getNearestOverflowAncestor(t) {
  const n = getParentNode(t)
  return isLastTraversableNode(n)
    ? t.ownerDocument
      ? t.ownerDocument.body
      : t.body
    : isHTMLElement(n) && isOverflowElement(n)
      ? n
      : getNearestOverflowAncestor(n)
}
function getOverflowAncestors(t, n, o) {
  var s
  n === void 0 && (n = []), o === void 0 && (o = !0)
  const r = getNearestOverflowAncestor(t),
    i = r === ((s = t.ownerDocument) == null ? void 0 : s.body),
    a = getWindow(r)
  if (i) {
    const c = getFrameElement(a)
    return n.concat(
      a,
      a.visualViewport || [],
      isOverflowElement(r) ? r : [],
      c && o ? getOverflowAncestors(c) : [],
    )
  }
  return n.concat(r, getOverflowAncestors(r, [], o))
}
function getFrameElement(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null
}
function getCssDimensions(t) {
  const n = getComputedStyle(t)
  let o = parseFloat(n.width) || 0,
    s = parseFloat(n.height) || 0
  const r = isHTMLElement(t),
    i = r ? t.offsetWidth : o,
    a = r ? t.offsetHeight : s,
    c = round(o) !== i || round(s) !== a
  return c && ((o = i), (s = a)), { width: o, height: s, $: c }
}
function unwrapElement(t) {
  return isElement(t) ? t : t.contextElement
}
function getScale(t) {
  const n = unwrapElement(t)
  if (!isHTMLElement(n)) return createCoords(1)
  const o = n.getBoundingClientRect(),
    { width: s, height: r, $: i } = getCssDimensions(n)
  let a = (i ? round(o.width) : o.width) / s,
    c = (i ? round(o.height) : o.height) / r
  return (
    (!a || !Number.isFinite(a)) && (a = 1), (!c || !Number.isFinite(c)) && (c = 1), { x: a, y: c }
  )
}
const noOffsets = createCoords(0)
function getVisualOffsets(t) {
  const n = getWindow(t)
  return !isWebKit() || !n.visualViewport
    ? noOffsets
    : { x: n.visualViewport.offsetLeft, y: n.visualViewport.offsetTop }
}
function shouldAddVisualOffsets(t, n, o) {
  return n === void 0 && (n = !1), !o || (n && o !== getWindow(t)) ? !1 : n
}
function getBoundingClientRect(t, n, o, s) {
  n === void 0 && (n = !1), o === void 0 && (o = !1)
  const r = t.getBoundingClientRect(),
    i = unwrapElement(t)
  let a = createCoords(1)
  n && (s ? isElement(s) && (a = getScale(s)) : (a = getScale(t)))
  const c = shouldAddVisualOffsets(i, o, s) ? getVisualOffsets(i) : createCoords(0)
  let u = (r.left + c.x) / a.x,
    g = (r.top + c.y) / a.y,
    d = r.width / a.x,
    v = r.height / a.y
  if (i) {
    const y = getWindow(i),
      _ = s && isElement(s) ? getWindow(s) : s
    let $ = y,
      A = getFrameElement($)
    for (; A && s && _ !== $; ) {
      const k = getScale(A),
        O = A.getBoundingClientRect(),
        j = getComputedStyle(A),
        B = O.left + (A.clientLeft + parseFloat(j.paddingLeft)) * k.x,
        P = O.top + (A.clientTop + parseFloat(j.paddingTop)) * k.y
      ;(u *= k.x),
        (g *= k.y),
        (d *= k.x),
        (v *= k.y),
        (u += B),
        (g += P),
        ($ = getWindow(A)),
        (A = getFrameElement($))
    }
  }
  return rectToClientRect({ width: d, height: v, x: u, y: g })
}
function getWindowScrollBarX(t, n) {
  const o = getNodeScroll(t).scrollLeft
  return n ? n.left + o : getBoundingClientRect(getDocumentElement(t)).left + o
}
function getHTMLOffset(t, n, o) {
  o === void 0 && (o = !1)
  const s = t.getBoundingClientRect(),
    r = s.left + n.scrollLeft - (o ? 0 : getWindowScrollBarX(t, s)),
    i = s.top + n.scrollTop
  return { x: r, y: i }
}
function convertOffsetParentRelativeRectToViewportRelativeRect(t) {
  let { elements: n, rect: o, offsetParent: s, strategy: r } = t
  const i = r === 'fixed',
    a = getDocumentElement(s),
    c = n ? isTopLayer(n.floating) : !1
  if (s === a || (c && i)) return o
  let u = { scrollLeft: 0, scrollTop: 0 },
    g = createCoords(1)
  const d = createCoords(0),
    v = isHTMLElement(s)
  if (
    (v || (!v && !i)) &&
    ((getNodeName(s) !== 'body' || isOverflowElement(a)) && (u = getNodeScroll(s)),
    isHTMLElement(s))
  ) {
    const _ = getBoundingClientRect(s)
    ;(g = getScale(s)), (d.x = _.x + s.clientLeft), (d.y = _.y + s.clientTop)
  }
  const y = a && !v && !i ? getHTMLOffset(a, u, !0) : createCoords(0)
  return {
    width: o.width * g.x,
    height: o.height * g.y,
    x: o.x * g.x - u.scrollLeft * g.x + d.x + y.x,
    y: o.y * g.y - u.scrollTop * g.y + d.y + y.y,
  }
}
function getClientRects(t) {
  return Array.from(t.getClientRects())
}
function getDocumentRect(t) {
  const n = getDocumentElement(t),
    o = getNodeScroll(t),
    s = t.ownerDocument.body,
    r = max(n.scrollWidth, n.clientWidth, s.scrollWidth, s.clientWidth),
    i = max(n.scrollHeight, n.clientHeight, s.scrollHeight, s.clientHeight)
  let a = -o.scrollLeft + getWindowScrollBarX(t)
  const c = -o.scrollTop
  return (
    getComputedStyle(s).direction === 'rtl' && (a += max(n.clientWidth, s.clientWidth) - r),
    { width: r, height: i, x: a, y: c }
  )
}
function getViewportRect(t, n) {
  const o = getWindow(t),
    s = getDocumentElement(t),
    r = o.visualViewport
  let i = s.clientWidth,
    a = s.clientHeight,
    c = 0,
    u = 0
  if (r) {
    ;(i = r.width), (a = r.height)
    const g = isWebKit()
    ;(!g || (g && n === 'fixed')) && ((c = r.offsetLeft), (u = r.offsetTop))
  }
  return { width: i, height: a, x: c, y: u }
}
const absoluteOrFixed = new Set(['absolute', 'fixed'])
function getInnerBoundingClientRect(t, n) {
  const o = getBoundingClientRect(t, !0, n === 'fixed'),
    s = o.top + t.clientTop,
    r = o.left + t.clientLeft,
    i = isHTMLElement(t) ? getScale(t) : createCoords(1),
    a = t.clientWidth * i.x,
    c = t.clientHeight * i.y,
    u = r * i.x,
    g = s * i.y
  return { width: a, height: c, x: u, y: g }
}
function getClientRectFromClippingAncestor(t, n, o) {
  let s
  if (n === 'viewport') s = getViewportRect(t, o)
  else if (n === 'document') s = getDocumentRect(getDocumentElement(t))
  else if (isElement(n)) s = getInnerBoundingClientRect(n, o)
  else {
    const r = getVisualOffsets(t)
    s = { x: n.x - r.x, y: n.y - r.y, width: n.width, height: n.height }
  }
  return rectToClientRect(s)
}
function hasFixedPositionAncestor(t, n) {
  const o = getParentNode(t)
  return o === n || !isElement(o) || isLastTraversableNode(o)
    ? !1
    : getComputedStyle(o).position === 'fixed' || hasFixedPositionAncestor(o, n)
}
function getClippingElementAncestors(t, n) {
  const o = n.get(t)
  if (o) return o
  let s = getOverflowAncestors(t, [], !1).filter((c) => isElement(c) && getNodeName(c) !== 'body'),
    r = null
  const i = getComputedStyle(t).position === 'fixed'
  let a = i ? getParentNode(t) : t
  for (; isElement(a) && !isLastTraversableNode(a); ) {
    const c = getComputedStyle(a),
      u = isContainingBlock(a)
    !u && c.position === 'fixed' && (r = null),
      (
        i
          ? !u && !r
          : (!u && c.position === 'static' && !!r && absoluteOrFixed.has(r.position)) ||
            (isOverflowElement(a) && !u && hasFixedPositionAncestor(t, a))
      )
        ? (s = s.filter((d) => d !== a))
        : (r = c),
      (a = getParentNode(a))
  }
  return n.set(t, s), s
}
function getClippingRect(t) {
  let { element: n, boundary: o, rootBoundary: s, strategy: r } = t
  const a = [
      ...(o === 'clippingAncestors'
        ? isTopLayer(n)
          ? []
          : getClippingElementAncestors(n, this._c)
        : [].concat(o)),
      s,
    ],
    c = a[0],
    u = a.reduce(
      (g, d) => {
        const v = getClientRectFromClippingAncestor(n, d, r)
        return (
          (g.top = max(v.top, g.top)),
          (g.right = min(v.right, g.right)),
          (g.bottom = min(v.bottom, g.bottom)),
          (g.left = max(v.left, g.left)),
          g
        )
      },
      getClientRectFromClippingAncestor(n, c, r),
    )
  return { width: u.right - u.left, height: u.bottom - u.top, x: u.left, y: u.top }
}
function getDimensions(t) {
  const { width: n, height: o } = getCssDimensions(t)
  return { width: n, height: o }
}
function getRectRelativeToOffsetParent(t, n, o) {
  const s = isHTMLElement(n),
    r = getDocumentElement(n),
    i = o === 'fixed',
    a = getBoundingClientRect(t, !0, i, n)
  let c = { scrollLeft: 0, scrollTop: 0 }
  const u = createCoords(0)
  function g() {
    u.x = getWindowScrollBarX(r)
  }
  if (s || (!s && !i))
    if (((getNodeName(n) !== 'body' || isOverflowElement(r)) && (c = getNodeScroll(n)), s)) {
      const _ = getBoundingClientRect(n, !0, i, n)
      ;(u.x = _.x + n.clientLeft), (u.y = _.y + n.clientTop)
    } else r && g()
  i && !s && r && g()
  const d = r && !s && !i ? getHTMLOffset(r, c) : createCoords(0),
    v = a.left + c.scrollLeft - u.x - d.x,
    y = a.top + c.scrollTop - u.y - d.y
  return { x: v, y, width: a.width, height: a.height }
}
function isStaticPositioned(t) {
  return getComputedStyle(t).position === 'static'
}
function getTrueOffsetParent(t, n) {
  if (!isHTMLElement(t) || getComputedStyle(t).position === 'fixed') return null
  if (n) return n(t)
  let o = t.offsetParent
  return getDocumentElement(t) === o && (o = o.ownerDocument.body), o
}
function getOffsetParent(t, n) {
  const o = getWindow(t)
  if (isTopLayer(t)) return o
  if (!isHTMLElement(t)) {
    let r = getParentNode(t)
    for (; r && !isLastTraversableNode(r); ) {
      if (isElement(r) && !isStaticPositioned(r)) return r
      r = getParentNode(r)
    }
    return o
  }
  let s = getTrueOffsetParent(t, n)
  for (; s && isTableElement(s) && isStaticPositioned(s); ) s = getTrueOffsetParent(s, n)
  return s && isLastTraversableNode(s) && isStaticPositioned(s) && !isContainingBlock(s)
    ? o
    : s || getContainingBlock(t) || o
}
const getElementRects = async function (t) {
  const n = this.getOffsetParent || getOffsetParent,
    o = this.getDimensions,
    s = await o(t.floating)
  return {
    reference: getRectRelativeToOffsetParent(t.reference, await n(t.floating), t.strategy),
    floating: { x: 0, y: 0, width: s.width, height: s.height },
  }
}
function isRTL(t) {
  return getComputedStyle(t).direction === 'rtl'
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL,
}
function rectsAreEqual(t, n) {
  return t.x === n.x && t.y === n.y && t.width === n.width && t.height === n.height
}
function observeMove(t, n) {
  let o = null,
    s
  const r = getDocumentElement(t)
  function i() {
    var c
    clearTimeout(s), (c = o) == null || c.disconnect(), (o = null)
  }
  function a(c, u) {
    c === void 0 && (c = !1), u === void 0 && (u = 1), i()
    const g = t.getBoundingClientRect(),
      { left: d, top: v, width: y, height: _ } = g
    if ((c || n(), !y || !_)) return
    const $ = floor(v),
      A = floor(r.clientWidth - (d + y)),
      k = floor(r.clientHeight - (v + _)),
      O = floor(d),
      B = {
        rootMargin: -$ + 'px ' + -A + 'px ' + -k + 'px ' + -O + 'px',
        threshold: max(0, min(1, u)) || 1,
      }
    let P = !0
    function F(Be) {
      const Se = Be[0].intersectionRatio
      if (Se !== u) {
        if (!P) return a()
        Se
          ? a(!1, Se)
          : (s = setTimeout(() => {
              a(!1, 1e-7)
            }, 1e3))
      }
      Se === 1 && !rectsAreEqual(g, t.getBoundingClientRect()) && a(), (P = !1)
    }
    try {
      o = new IntersectionObserver(F, { ...B, root: r.ownerDocument })
    } catch {
      o = new IntersectionObserver(F, B)
    }
    o.observe(t)
  }
  return a(!0), i
}
function autoUpdate(t, n, o, s) {
  s === void 0 && (s = {})
  const {
      ancestorScroll: r = !0,
      ancestorResize: i = !0,
      elementResize: a = typeof ResizeObserver == 'function',
      layoutShift: c = typeof IntersectionObserver == 'function',
      animationFrame: u = !1,
    } = s,
    g = unwrapElement(t),
    d = r || i ? [...(g ? getOverflowAncestors(g) : []), ...getOverflowAncestors(n)] : []
  d.forEach((O) => {
    r && O.addEventListener('scroll', o, { passive: !0 }), i && O.addEventListener('resize', o)
  })
  const v = g && c ? observeMove(g, o) : null
  let y = -1,
    _ = null
  a &&
    ((_ = new ResizeObserver((O) => {
      let [j] = O
      j &&
        j.target === g &&
        _ &&
        (_.unobserve(n),
        cancelAnimationFrame(y),
        (y = requestAnimationFrame(() => {
          var B
          ;(B = _) == null || B.observe(n)
        }))),
        o()
    })),
    g && !u && _.observe(g),
    _.observe(n))
  let $,
    A = u ? getBoundingClientRect(t) : null
  u && k()
  function k() {
    const O = getBoundingClientRect(t)
    A && !rectsAreEqual(A, O) && o(), (A = O), ($ = requestAnimationFrame(k))
  }
  return (
    o(),
    () => {
      var O
      d.forEach((j) => {
        r && j.removeEventListener('scroll', o), i && j.removeEventListener('resize', o)
      }),
        v?.(),
        (O = _) == null || O.disconnect(),
        (_ = null),
        u && cancelAnimationFrame($)
    }
  )
}
const offset = offset$1,
  shift = shift$1,
  flip = flip$1,
  computePosition = (t, n, o) => {
    const s = new Map(),
      r = { platform, ...o },
      i = { ...r.platform, _c: s }
    return computePosition$1(t, n, { ...r, platform: i })
  }
'stream' in Blob.prototype ||
  Object.defineProperty(Blob.prototype, 'stream', {
    value() {
      return new Response(this).body
    },
  }),
  'setBigUint64' in DataView.prototype ||
    Object.defineProperty(DataView.prototype, 'setBigUint64', {
      value(t, n, o) {
        const s = Number(0xffffffffn & n),
          r = Number(n >> 32n)
        this.setUint32(t + (o ? 0 : 4), s, o), this.setUint32(t + (o ? 4 : 0), r, o)
      },
    })
var l = new Uint32Array(256)
for (let t = 0; t < 256; ++t) {
  let n = t
  for (let o = 0; o < 8; ++o) n = (n >>> 1) ^ (1 & n && 3988292384)
  l[t] = n
}
new TextDecoder('utf8', { fatal: 1 })
const _hoisted_1$5 = { class: 'form-wrapper' },
  _hoisted_2$5 = { class: 'form-group' },
  _hoisted_3$5 = { key: 0, class: 'selected' },
  _hoisted_4$4 = { class: 'form-group' },
  _hoisted_5$4 = { key: 0, class: 'selected' },
  _hoisted_6$4 = { class: 'form-group' },
  _hoisted_7$3 = { class: 'document-actions' },
  _hoisted_8$3 = ['onClick'],
  _hoisted_9$3 = ['onClick'],
  _hoisted_10$2 = { key: 0, class: 'side-modal' },
  _hoisted_11$2 = { class: 'side-modal-content' },
  _sfc_main$5 = {
    __name: 'DocumentGenerator',
    setup(__props) {
      const route = useRoute()
      computed(() => route.query.document_id && route.query.fca && route.query.group)
      const token = localStorage.getItem('token'),
        fcas = ref([]),
        groups = ref([]),
        documents = ref([]),
        selectedFca = ref(null),
        selectedGroup = ref(null),
        selectedDocuments = ref([]),
        searchFca = ref(''),
        searchGroup = ref(''),
        showModal = ref(!1),
        selectedDocForModal = ref(null),
        formData = reactive({})
      ref([1, 2, 3, 4, 5])
      const isFcaDropdownOpen = ref(!1),
        isGroupDropdownOpen = ref(!1),
        fcaInputRef = ref(null),
        fcaDropdownRef = ref(null),
        groupInputRef = ref(null),
        groupDropdownRef = ref(null),
        fetchFcas = async () => {
          const n = await (
            await fetch('https://api-abealcala.duckdns.org/fcas', {
              headers: { Authorization: `Bearer ${token}` },
            })
          ).json()
          fcas.value = n.data || []
        },
        fetchGroups = async () => {
          const t = await fetch('https://api-abealcala.duckdns.org/groups', {
            headers: { Authorization: `Bearer ${token}` },
          })
          groups.value = await t.json()
        },
        fetchDocuments = async () => {
          if (!selectedGroup.value) return
          const n = await (
            await fetch(
              `https://api-abealcala.duckdns.org/documents?group=${selectedGroup.value.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )
          ).json()
          documents.value = n.data || []
        }
      function camel(t) {
        return t
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .split(' ')
          .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
          .join('')
      }
      function getFieldComponent(t) {
        switch (t.field_type) {
          case 'text':
          case 'number':
          case 'money':
            return InputField
          case 'date':
            return DateField
          case 'dropdown':
            return DropdownField
          case 'checkbox':
            return _sfc_main$m
          case 'radio':
            return _sfc_main$n
          case 'table':
            return _sfc_main$l
          default:
            return 'div'
        }
      }
      async function openFormModal(doc) {
        selectedDocForModal.value = doc
        const schema = doc.schema || []
        for (const t of schema) {
          const n = camel(t.field_label)
          if (t.field_type === 'date') formData[n] = { month: '', day: '', year: '' }
          else if (['checkbox', 'dropdown'].includes(t.field_type) && t.properties.multiple)
            formData[n] = []
          else if (t.field_type === 'table') {
            const o = t.properties.min_rows || 0,
              s = () =>
                Object.fromEntries(
                  t.properties.columns.map((r) => [
                    camel(r.field_label),
                    ['checkbox', 'dropdown'].includes(r.field_type) && r.properties.multiple
                      ? []
                      : '',
                  ]),
                )
            formData[n] = Array.from({ length: o }, s)
          } else formData[n] = ''
        }
        try {
          const res = await fetch(
              `https://api-abealcala.duckdns.org/generations?fca_id=${selectedFca.value?.id}&document_id=${doc.id}`,
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            generations = await res.json(),
            match = Array.isArray(generations) ? generations[0] : generations
          if (match && match.meta_data) {
            let meta = match.meta_data
            if (typeof meta == 'string')
              try {
                meta = JSON.parse(meta)
              } catch (e) {
                try {
                  meta = eval('(' + meta + ')')
                } catch (t) {
                  meta = {}
                }
              }
            Object.entries(meta).forEach(([t, n]) => {
              t in formData && (formData[t] = n)
            })
          }
        } catch (t) {}
        showModal.value = !0
      }
      function closeModal() {
        ;(showModal.value = !1), (selectedDocForModal.value = null)
      }
      async function submitForm() {
        if (!selectedFca.value || !selectedDocForModal.value) {
          alert('Missing FCA or Document')
          return
        }
        try {
          if (
            !(
              await fetch('https://api-abealcala.duckdns.org/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  fca_id: selectedFca.value.id,
                  document_id: selectedDocForModal.value.id,
                  form: formData,
                }),
              })
            ).ok
          )
            throw new Error('Failed to generate document')
          alert('Document generated successfully!'), closeModal()
        } catch (t) {
          alert('Error: ' + t.message)
        }
      }
      const positionFloating = (t, n) => {
        !t.value ||
          !n.value ||
          autoUpdate(t.value, n.value, () => {
            computePosition(t.value, n.value, {
              placement: 'bottom-start',
              middleware: [offset(4), flip(), shift()],
            }).then(({ x: o, y: s }) => {
              Object.assign(n.value.style, {
                left: `${o}px`,
                top: `${s}px`,
                position: 'absolute',
                zIndex: 1e3,
              })
            })
          })
      }
      watch(isFcaDropdownOpen, (t) => t && positionFloating(fcaInputRef, fcaDropdownRef)),
        watch(isGroupDropdownOpen, (t) => t && positionFloating(groupInputRef, groupDropdownRef)),
        computed(() =>
          searchFca.value
            ? fuzzysort.go(searchFca.value, fcas.value, { key: 'name' }).map((t) => t.obj)
            : fcas.value,
        ),
        computed(() =>
          searchGroup.value
            ? fuzzysort.go(searchGroup.value, groups.value, { key: 'name' }).map((t) => t.obj)
            : groups.value,
        )
      async function downloadDocument(t) {
        if (!selectedFca.value || !t) {
          alert('Please select an FCA and document.')
          return
        }
        try {
          const n = await fetch('https://api-abealcala.duckdns.org/download_document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ fca_id: selectedFca.value.id, document_id: t.id }),
          })
          if (!n.ok) throw new Error('Failed to download document')
          const o = await n.blob(),
            s = window.URL.createObjectURL(o),
            r = document.createElement('a')
          ;(r.href = s),
            (r.download = `${t.name || 'document'}.docx`),
            document.body.appendChild(r),
            r.click(),
            r.remove(),
            window.URL.revokeObjectURL(s)
        } catch (n) {
          alert('Error: ' + n.message)
        }
      }
      const onFcaChange = () => {
          const t = fcas.value.find((n) => n.name === searchFca.value)
          t && (selectedFca.value = t)
        },
        onGroupChange = () => {
          const t = groups.value.find((n) => n.name === searchGroup.value)
          t && ((selectedGroup.value = t), fetchDocuments())
        }
      return (
        onMounted(async () => {
          await fetchFcas(), await fetchGroups()
          const t = route.query.fca,
            n = route.query.group,
            o = Number(route.query.document_id)
          if (t) {
            const s = fcas.value.find((r) => r.name === t)
            s && ((selectedFca.value = s), (searchFca.value = s.name))
          }
          if (n) {
            const s = groups.value.find((r) => r.name === n)
            if (
              s &&
              ((selectedGroup.value = s), (searchGroup.value = s.name), await fetchDocuments(), o)
            ) {
              const r = documents.value.find((i) => i.id === o)
              r && ((selectedDocuments.value = [r]), openFormModal(r))
            }
          }
        }),
        (t, n) => {
          const o = resolveComponent('v-select')
          return (
            openBlock(),
            createElementBlock('div', _hoisted_1$5, [
              n[6] ||
                (n[6] = createBaseVNode('h1', { class: 'form-title' }, 'Generate Documents', -1)),
              createBaseVNode('div', _hoisted_2$5, [
                n[2] || (n[2] = createBaseVNode('label', { for: 'fcaInput' }, 'FCA', -1)),
                createVNode(
                  o,
                  {
                    modelValue: searchFca.value,
                    'onUpdate:modelValue': [
                      n[0] || (n[0] = (s) => (searchFca.value = s)),
                      onFcaChange,
                    ],
                    options: fcas.value,
                    label: 'name',
                    reduce: (s) => s.name,
                    class: 'my-vue-select',
                    placeholder: 'Search FCA...',
                    clearable: '',
                  },
                  null,
                  8,
                  ['modelValue', 'options', 'reduce'],
                ),
                selectedFca.value
                  ? (openBlock(),
                    createElementBlock(
                      'p',
                      _hoisted_3$5,
                      'Selected: ' + toDisplayString(selectedFca.value.name),
                      1,
                    ))
                  : createCommentVNode('', !0),
              ]),
              createBaseVNode('div', _hoisted_4$4, [
                n[3] || (n[3] = createBaseVNode('label', { for: 'groupInput' }, 'Group', -1)),
                createVNode(
                  o,
                  {
                    modelValue: searchGroup.value,
                    'onUpdate:modelValue': [
                      n[1] || (n[1] = (s) => (searchGroup.value = s)),
                      onGroupChange,
                    ],
                    options: groups.value,
                    label: 'name',
                    reduce: (s) => s.name,
                    class: 'my-vue-select',
                    placeholder: 'Search group...',
                    clearable: '',
                  },
                  null,
                  8,
                  ['modelValue', 'options', 'reduce'],
                ),
                createTextVNode(' ' + toDisplayString(searchGroup.value) + ' ', 1),
                selectedGroup.value
                  ? (openBlock(),
                    createElementBlock(
                      'p',
                      _hoisted_5$4,
                      'Selected: ' + toDisplayString(selectedGroup.value.name),
                      1,
                    ))
                  : createCommentVNode('', !0),
              ]),
              createBaseVNode('div', _hoisted_6$4, [
                n[4] || (n[4] = createBaseVNode('h3', null, 'Documents', -1)),
                (openBlock(!0),
                createElementBlock(
                  Fragment,
                  null,
                  renderList(
                    documents.value,
                    (s) => (
                      openBlock(),
                      createElementBlock('div', { key: s.id, class: 'document-item' }, [
                        createBaseVNode('label', null, toDisplayString(s.name), 1),
                        createBaseVNode('div', _hoisted_7$3, [
                          s.schema
                            ? (openBlock(),
                              createElementBlock(
                                'button',
                                { key: 0, class: 'btn', onClick: (r) => openFormModal(s) },
                                'Fill',
                                8,
                                _hoisted_8$3,
                              ))
                            : createCommentVNode('', !0),
                          createBaseVNode(
                            'button',
                            { class: 'btn', onClick: (r) => downloadDocument(s) },
                            'Download',
                            8,
                            _hoisted_9$3,
                          ),
                        ]),
                      ])
                    ),
                  ),
                  128,
                )),
              ]),
              showModal.value
                ? (openBlock(),
                  createElementBlock('div', _hoisted_10$2, [
                    createBaseVNode('div', _hoisted_11$2, [
                      createBaseVNode(
                        'h1',
                        null,
                        toDisplayString(selectedDocForModal.value?.name),
                        1,
                      ),
                      createBaseVNode(
                        'form',
                        { onSubmit: withModifiers(submitForm, ['prevent']) },
                        [
                          (openBlock(!0),
                          createElementBlock(
                            Fragment,
                            null,
                            renderList(
                              selectedDocForModal.value.schema,
                              (s, r) => (
                                openBlock(),
                                createElementBlock('div', { key: r, class: 'form-group' }, [
                                  (openBlock(),
                                  createBlock(
                                    resolveDynamicComponent(getFieldComponent(s)),
                                    {
                                      field: s,
                                      modelValue: formData[camel(s.field_label)],
                                      'onUpdate:modelValue': (i) =>
                                        (formData[camel(s.field_label)] = i),
                                    },
                                    null,
                                    8,
                                    ['field', 'modelValue', 'onUpdate:modelValue'],
                                  )),
                                ])
                              ),
                            ),
                            128,
                          )),
                          createBaseVNode('div', { class: 'modal-buttons' }, [
                            n[5] ||
                              (n[5] = createBaseVNode(
                                'button',
                                { type: 'submit', class: 'btn' },
                                'Submit',
                                -1,
                              )),
                            createBaseVNode(
                              'button',
                              { type: 'button', class: 'btn secondary', onClick: closeModal },
                              'Cancel',
                            ),
                          ]),
                        ],
                        32,
                      ),
                    ]),
                  ]))
                : createCommentVNode('', !0),
            ])
          )
        }
      )
    },
  },
  DocumentGenerator = _export_sfc(_sfc_main$5, [['__scopeId', 'data-v-b165e5e2']]),
  _hoisted_1$4 = { class: 'container' },
  _hoisted_2$4 = { class: 'filters' },
  _hoisted_3$4 = { class: 'pagination' },
  _hoisted_4$3 = ['disabled'],
  _hoisted_5$3 = ['disabled'],
  _hoisted_6$3 = { class: 'limit' },
  _sfc_main$4 = {
    __name: 'DocumentView',
    setup(t) {
      const n = localStorage.getItem('token'),
        o = useRouter(),
        s = useRoute(),
        r = ref([]),
        i = ref(0),
        a = ref(''),
        c = ref(''),
        u = ref(''),
        g = ref('')
      ref(''), ref(''), ref(''), ref('')
      const d = ref([]),
        v = ref([]),
        y = ref([]),
        _ = ref([]),
        $ = ref(Number(s.query.page) || 1),
        A = ref(Number(s.query.limit) || 10),
        k = ref(s.query.sort || 'updated_at'),
        O = ref(s.query.order || 'desc'),
        j = computed(() => Math.ceil(i.value / A.value)),
        B = [
          { label: 'Document', key: 'document_name' },
          { label: 'FCA', key: 'fca_name' },
          { label: 'Group', key: 'group_name' },
          { label: 'User', key: 'created_by_username' },
          { label: 'Updated At', key: 'updated_at', sortable: !0 },
        ]
      function P(K) {
        k.value === K
          ? (O.value = O.value === 'asc' ? 'desc' : 'asc')
          : ((k.value = K), (O.value = 'asc')),
          Se()
      }
      function F(K, De, je) {
        o.push(
          `/generate?document_id=${K}&fca=${encodeURIComponent(De)}&group=${encodeURIComponent(je)}`,
        )
      }
      async function Be(K) {
        if (confirm('Delete this document?'))
          try {
            const De = await fetch(`https://api-abealcala.duckdns.org/generated_document/${K}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${n}` },
            })
            if (!De.ok) {
              const je = await De.json()
              throw new Error(je.message || 'Failed to delete document.')
            }
            alert(`Deleted document ${K}`), await Se()
          } catch (De) {
            alert('Error: ' + De.message)
          }
      }
      async function Se() {
        const K = new URLSearchParams()
        a.value && K.append('document_name', a.value.name),
          c.value && K.append('fca_name', c.value.name),
          u.value && K.append('user_name', u.value.name),
          g.value && K.append('group_name', g.value.name),
          K.append('sort', k.value),
          K.append('order', O.value),
          K.append('page', $.value),
          K.append('limit', A.value)
        const je = await (
          await fetch(`https://api-abealcala.duckdns.org/generated_documents?${K}`, {
            headers: { Authorization: `Bearer ${n}` },
          })
        ).json()
        ;(r.value = je.data), (i.value = je.total)
      }
      const L = async () => {
          const De = await (
            await fetch('https://api-abealcala.duckdns.org/documents', {
              headers: { Authorization: `Bearer ${n}` },
            })
          ).json()
          d.value = De.data || []
        },
        R = async () => {
          try {
            const De = await (
              await fetch('https://api-abealcala.duckdns.org/fcas', {
                headers: { Authorization: `Bearer ${n}` },
              })
            ).json()
            v.value = De.data || []
          } catch (K) {
            console.error('Failed to fetch FCAs:', K)
          }
        },
        D = async () => {
          try {
            const De = await (
              await fetch('https://api-abealcala.duckdns.org/groups', {
                headers: { Authorization: `Bearer ${n}` },
              })
            ).json()
            ;(y.value = De || []), console.log(y.value)
          } catch (K) {
            console.error('Failed to fetch groups:', K)
          }
        },
        Te = async () => {
          try {
            const De = await (
              await fetch('https://api-abealcala.duckdns.org/users', {
                headers: { Authorization: `Bearer ${n}` },
              })
            ).json()
            _.value = De || []
          } catch (K) {
            console.error('Failed to fetch users:', K)
          }
        }
      return (
        watch([$, A, k, O], () => {
          o.replace({ query: { page: $.value, limit: A.value, sort: k.value, order: O.value } })
        }),
        onMounted(() => {
          Se(), R(), D(), Te(), L()
        }),
        (K, De) => {
          const je = resolveComponent('v-select')
          return (
            openBlock(),
            createElementBlock('div', _hoisted_1$4, [
              createVNode(
                TitleBar,
                { title: 'Generated Documents', icon: unref(Document20) },
                null,
                8,
                ['icon'],
              ),
              createBaseVNode('div', _hoisted_2$4, [
                createVNode(
                  je,
                  {
                    modelValue: a.value,
                    'onUpdate:modelValue': De[0] || (De[0] = (Pe) => (a.value = Pe)),
                    options: d.value,
                    label: 'name',
                    reduce: (Pe) => Pe,
                    placeholder: 'Select Document',
                  },
                  null,
                  8,
                  ['modelValue', 'options', 'reduce'],
                ),
                createVNode(
                  je,
                  {
                    modelValue: c.value,
                    'onUpdate:modelValue': De[1] || (De[1] = (Pe) => (c.value = Pe)),
                    options: v.value,
                    label: 'name',
                    reduce: (Pe) => Pe,
                    placeholder: 'Select FCA',
                  },
                  null,
                  8,
                  ['modelValue', 'options', 'reduce'],
                ),
                createVNode(
                  je,
                  {
                    modelValue: g.value,
                    'onUpdate:modelValue': De[2] || (De[2] = (Pe) => (g.value = Pe)),
                    options: y.value,
                    label: 'name',
                    reduce: (Pe) => Pe,
                    placeholder: 'Select group',
                  },
                  null,
                  8,
                  ['modelValue', 'options', 'reduce'],
                ),
                createVNode(
                  je,
                  {
                    modelValue: u.value,
                    'onUpdate:modelValue': De[3] || (De[3] = (Pe) => (u.value = Pe)),
                    options: _.value,
                    label: 'name',
                    reduce: (Pe) => Pe,
                    placeholder: 'Select User',
                  },
                  null,
                  8,
                  ['modelValue', 'options', 'reduce'],
                ),
                createBaseVNode('button', { onClick: Se }, 'Apply'),
              ]),
              createVNode(
                DataTable,
                { data: r.value, columns: B, sort: { column: k.value, order: O.value }, onSort: P },
                {
                  actions: withCtx(({ row: Pe }) => [
                    createVNode(
                      unref(View20),
                      {
                        title: 'View',
                        class: 'action-icon',
                        onClick: (xe) => F(Pe.document_id, Pe.fca_name, Pe.group_name),
                      },
                      null,
                      8,
                      ['onClick'],
                    ),
                    createVNode(
                      unref(TrashCan20),
                      {
                        title: 'Delete',
                        class: 'action-icon text-red',
                        onClick: (xe) => Be(Pe.id),
                      },
                      null,
                      8,
                      ['onClick'],
                    ),
                  ]),
                  _: 1,
                },
                8,
                ['data', 'sort'],
              ),
              createBaseVNode('div', _hoisted_3$4, [
                createBaseVNode('div', null, [
                  createBaseVNode(
                    'button',
                    {
                      disabled: $.value === 1,
                      onClick: De[4] || (De[4] = (Pe) => $.value-- && Se()),
                    },
                    'Prev',
                    8,
                    _hoisted_4$3,
                  ),
                  createBaseVNode(
                    'span',
                    null,
                    'Page ' + toDisplayString($.value) + ' of ' + toDisplayString(j.value),
                    1,
                  ),
                  createBaseVNode(
                    'button',
                    {
                      disabled: $.value >= j.value,
                      onClick: De[5] || (De[5] = (Pe) => $.value++ && Se()),
                    },
                    'Next',
                    8,
                    _hoisted_5$3,
                  ),
                ]),
                createBaseVNode('div', _hoisted_6$3, [
                  De[9] || (De[9] = createBaseVNode('label', null, 'Rows per page:', -1)),
                  withDirectives(
                    createBaseVNode(
                      'select',
                      {
                        'onUpdate:modelValue': De[6] || (De[6] = (Pe) => (A.value = Pe)),
                        onChange: De[7] || (De[7] = (Pe) => Se()),
                      },
                      De[8] ||
                        (De[8] = [
                          createBaseVNode('option', { value: 10 }, '10', -1),
                          createBaseVNode('option', { value: 25 }, '25', -1),
                          createBaseVNode('option', { value: 50 }, '50', -1),
                        ]),
                      544,
                    ),
                    [[vModelSelect, A.value]],
                  ),
                ]),
              ]),
            ])
          )
        }
      )
    },
  },
  DocumentView = _export_sfc(_sfc_main$4, [['__scopeId', 'data-v-d5cfce75']]),
  _hoisted_1$3 = { class: 'fca-data-view' },
  _hoisted_2$3 = { key: 0, class: 'profile-tab' },
  _hoisted_3$3 = { class: 'flex justify-between items-center mb-4' },
  _hoisted_4$2 = { key: 0, class: 'p-4 text-center' },
  _hoisted_5$2 = { key: 1 },
  _hoisted_6$2 = { style: { 'margin-top': '20px' } },
  _hoisted_7$2 = { class: 'row' },
  _hoisted_8$2 = { class: 'field' },
  _hoisted_9$2 = { class: 'field' },
  _hoisted_10$1 = { class: 'field' },
  _hoisted_11$1 = { class: 'field' },
  _hoisted_12$1 = { class: 'field' },
  _hoisted_13 = { class: 'row' },
  _hoisted_14 = { class: 'field' },
  _hoisted_15 = { class: 'field' },
  _hoisted_16 = { class: 'field' },
  _hoisted_17 = { class: 'field' },
  _hoisted_18 = { class: 'field' },
  _hoisted_19 = { class: 'row' },
  _hoisted_20 = { class: 'field' },
  _hoisted_21 = { class: 'field' },
  _hoisted_22 = { class: 'field' },
  _hoisted_23 = { class: 'row' },
  _hoisted_24 = { class: 'field' },
  _hoisted_25 = { class: 'field' },
  _hoisted_26 = { class: 'field' },
  _hoisted_27 = { key: 0, class: 'text-gray-500' },
  _hoisted_28 = { class: 'row' },
  _hoisted_29 = { class: 'field' },
  _hoisted_30 = { class: 'field' },
  _hoisted_31 = { class: 'field' },
  _hoisted_32 = { class: 'row' },
  _hoisted_33 = { class: 'field' },
  _hoisted_34 = { class: 'field' },
  _hoisted_35 = { key: 0, class: 'text-gray-500' },
  _hoisted_36 = { class: 'row' },
  _hoisted_37 = { class: 'field' },
  _hoisted_38 = { key: 1, class: 'documents-tab' },
  _hoisted_39 = { class: 'filters' },
  _hoisted_40 = ['href'],
  _hoisted_41 = { class: 'pagination' },
  _hoisted_42 = ['disabled'],
  _hoisted_43 = ['disabled'],
  _hoisted_44 = { class: 'limit' },
  _hoisted_45 = { key: 2, class: 'modal-overlay' },
  _hoisted_46 = { class: 'modal-content' },
  _sfc_main$3 = {
    __name: 'FcaDataView',
    setup(t) {
      const n = localStorage.getItem('token'),
        o = useRoute(),
        s = Number(o.params.id) || 2,
        r = ref('profile'),
        i = ref(!0),
        a = reactive({ general: {}, organization: {}, officers: [], bods: [] }),
        c = ref(!1)
      function u(L) {
        return L ? new Date(L).toLocaleDateString() : ''
      }
      async function g() {
        i.value = !0
        const L = await fetch(`https://api-abealcala.duckdns.org/fca/${s}`, {
          headers: { Authorization: `Bearer ${n}` },
        })
        Object.assign(a, await L.json()), (i.value = !1)
      }
      function d() {
        g(), (c.value = !1)
      }
      const v = ref([]),
        y = ref(''),
        _ = ref(''),
        $ = ref(''),
        A = ref(1),
        k = ref(10),
        O = ref('updated_at'),
        j = ref('desc'),
        B = ref(0)
      async function P() {
        console.log('Fetching documents...', s)
        const L = new URLSearchParams()
        L.append('fca_id', s),
          y.value && L.append('document_name', y.value),
          _.value && L.append('user_name', _.value),
          $.value && L.append('group_name', $.value),
          L.append('sort', O.value),
          L.append('order', j.value),
          L.append('page', A.value),
          L.append('limit', k.value),
          console.log('Params:', L.toString())
        const D = await (
          await fetch(`https://api-abealcala.duckdns.org/generated_documents?${L}`, {
            headers: { Authorization: `Bearer ${n}` },
          })
        ).json()
        ;(v.value = D.data.map((Te) => ({
          ...Te,
          download_url: Te.download_url || `/api/documents/${Te.id}/download`,
        }))),
          (B.value = D.total)
      }
      const F = [
          { label: 'Document', key: 'document_name' },
          { label: 'Group', key: 'group_name' },
          { label: 'User', key: 'created_by_username' },
          { label: 'Updated At', key: 'updated_at', sortable: !0 },
        ],
        Be = computed(() => Math.ceil(B.value / k.value))
      function Se(L) {
        O.value === L
          ? (j.value = j.value === 'asc' ? 'desc' : 'asc')
          : ((O.value = L), (j.value = 'asc')),
          P()
      }
      return (
        watch([A, k, O, j], P),
        onMounted(() => {
          g(), P()
        }),
        (L, R) => {
          const D = resolveComponent('Download20')
          return (
            openBlock(),
            createElementBlock('div', _hoisted_1$3, [
              createVNode(TitleBar, { title: 'FCA Details', icon: unref(Document20) }, null, 8, [
                'icon',
              ]),
              r.value === 'profile'
                ? (openBlock(),
                  createElementBlock('div', _hoisted_2$3, [
                    createBaseVNode('div', _hoisted_3$3, [
                      createBaseVNode(
                        'button',
                        { class: 'edit-btn', onClick: R[0] || (R[0] = (Te) => (c.value = !0)) },
                        'Edit FCA',
                      ),
                    ]),
                    i.value
                      ? (openBlock(), createElementBlock('div', _hoisted_4$2, 'Loading...'))
                      : (openBlock(),
                        createElementBlock('div', _hoisted_5$2, [
                          createBaseVNode('section', _hoisted_6$2, [
                            R[23] ||
                              (R[23] = createBaseVNode('h3', null, 'General Information', -1)),
                            createBaseVNode('div', _hoisted_7$2, [
                              createBaseVNode('div', _hoisted_8$2, [
                                R[10] || (R[10] = createBaseVNode('strong', null, 'Name:', -1)),
                                createTextVNode(' ' + toDisplayString(a.general.name), 1),
                              ]),
                              createBaseVNode('div', _hoisted_9$2, [
                                R[11] || (R[11] = createBaseVNode('strong', null, 'Acronym:', -1)),
                                createTextVNode(' ' + toDisplayString(a.general.acronym), 1),
                              ]),
                              createBaseVNode('div', _hoisted_10$1, [
                                R[12] || (R[12] = createBaseVNode('strong', null, 'Type:', -1)),
                                createTextVNode(' ' + toDisplayString(a.general.type), 1),
                              ]),
                              createBaseVNode('div', _hoisted_11$1, [
                                R[13] || (R[13] = createBaseVNode('strong', null, 'Reg No:', -1)),
                                createTextVNode(' ' + toDisplayString(a.general.reg_no), 1),
                              ]),
                              createBaseVNode('div', _hoisted_12$1, [
                                R[14] ||
                                  (R[14] = createBaseVNode('strong', null, 'Year Registered:', -1)),
                                createTextVNode(
                                  ' ' + toDisplayString(a.general.year_registered),
                                  1,
                                ),
                              ]),
                            ]),
                            createBaseVNode('div', _hoisted_13, [
                              createBaseVNode('div', _hoisted_14, [
                                R[15] || (R[15] = createBaseVNode('strong', null, 'Barangay:', -1)),
                                createTextVNode(' ' + toDisplayString(a.general.brgy), 1),
                              ]),
                              createBaseVNode('div', _hoisted_15, [
                                R[16] || (R[16] = createBaseVNode('strong', null, 'Street:', -1)),
                                createTextVNode(' ' + toDisplayString(a.general.street), 1),
                              ]),
                              createBaseVNode('div', _hoisted_16, [
                                R[17] ||
                                  (R[17] = createBaseVNode('strong', null, 'Municipality:', -1)),
                                createTextVNode(' ' + toDisplayString(a.general.municipality), 1),
                              ]),
                              createBaseVNode('div', _hoisted_17, [
                                R[18] || (R[18] = createBaseVNode('strong', null, 'Province:', -1)),
                                createTextVNode(' ' + toDisplayString(a.general.province), 1),
                              ]),
                              createBaseVNode('div', _hoisted_18, [
                                R[19] || (R[19] = createBaseVNode('strong', null, 'Zip Code:', -1)),
                                createTextVNode(' ' + toDisplayString(a.general.zip_code), 1),
                              ]),
                            ]),
                            createBaseVNode('div', _hoisted_19, [
                              createBaseVNode('div', _hoisted_20, [
                                R[20] ||
                                  (R[20] = createBaseVNode('strong', null, 'Major Commodity:', -1)),
                                createTextVNode(
                                  ' ' + toDisplayString(a.general.major_commodity),
                                  1,
                                ),
                              ]),
                              createBaseVNode('div', _hoisted_21, [
                                R[21] ||
                                  (R[21] = createBaseVNode('strong', null, 'Total Members:', -1)),
                                createTextVNode(' ' + toDisplayString(a.general.total_members), 1),
                              ]),
                              createBaseVNode('div', _hoisted_22, [
                                R[22] ||
                                  (R[22] = createBaseVNode(
                                    'strong',
                                    null,
                                    'Business Operation:',
                                    -1,
                                  )),
                                createTextVNode(
                                  ' ' + toDisplayString(a.general.business_operation),
                                  1,
                                ),
                              ]),
                            ]),
                          ]),
                          createBaseVNode('section', null, [
                            R[27] ||
                              (R[27] = createBaseVNode('h3', null, 'Organization Contact', -1)),
                            createBaseVNode('div', _hoisted_23, [
                              createBaseVNode('div', _hoisted_24, [
                                R[24] || (R[24] = createBaseVNode('strong', null, 'Landline:', -1)),
                                createTextVNode(' ' + toDisplayString(a.organization.landline), 1),
                              ]),
                              createBaseVNode('div', _hoisted_25, [
                                R[25] || (R[25] = createBaseVNode('strong', null, 'Email:', -1)),
                                createTextVNode(' ' + toDisplayString(a.organization.email), 1),
                              ]),
                              createBaseVNode('div', _hoisted_26, [
                                R[26] || (R[26] = createBaseVNode('strong', null, 'Website:', -1)),
                                createTextVNode(' ' + toDisplayString(a.organization.website), 1),
                              ]),
                            ]),
                          ]),
                          createBaseVNode('section', null, [
                            R[33] || (R[33] = createBaseVNode('h3', null, 'Officers', -1)),
                            a.officers.length === 0
                              ? (openBlock(),
                                createElementBlock('div', _hoisted_27, 'No officers listed.'))
                              : createCommentVNode('', !0),
                            (openBlock(!0),
                            createElementBlock(
                              Fragment,
                              null,
                              renderList(
                                a.officers,
                                (Te) => (
                                  openBlock(),
                                  createElementBlock(
                                    'div',
                                    { key: Te.id, class: 'officer-block' },
                                    [
                                      createBaseVNode('div', _hoisted_28, [
                                        createBaseVNode('div', _hoisted_29, [
                                          R[28] ||
                                            (R[28] = createBaseVNode('strong', null, 'Name:', -1)),
                                          createTextVNode(' ' + toDisplayString(Te.name), 1),
                                        ]),
                                        createBaseVNode('div', _hoisted_30, [
                                          R[29] ||
                                            (R[29] = createBaseVNode(
                                              'strong',
                                              null,
                                              'Position:',
                                              -1,
                                            )),
                                          createTextVNode(' ' + toDisplayString(Te.position), 1),
                                        ]),
                                        createBaseVNode('div', _hoisted_31, [
                                          R[30] ||
                                            (R[30] = createBaseVNode(
                                              'strong',
                                              null,
                                              'Civil Status:',
                                              -1,
                                            )),
                                          createTextVNode(
                                            ' ' + toDisplayString(Te.civil_status),
                                            1,
                                          ),
                                        ]),
                                      ]),
                                      createBaseVNode('div', _hoisted_32, [
                                        createBaseVNode('div', _hoisted_33, [
                                          R[31] ||
                                            (R[31] = createBaseVNode(
                                              'strong',
                                              null,
                                              'Birth Date:',
                                              -1,
                                            )),
                                          createTextVNode(
                                            ' ' + toDisplayString(u(Te.birth_date)),
                                            1,
                                          ),
                                        ]),
                                        createBaseVNode('div', _hoisted_34, [
                                          R[32] ||
                                            (R[32] = createBaseVNode(
                                              'strong',
                                              null,
                                              'Mobile No:',
                                              -1,
                                            )),
                                          createTextVNode(' ' + toDisplayString(Te.mobile_no), 1),
                                        ]),
                                      ]),
                                    ],
                                  )
                                ),
                              ),
                              128,
                            )),
                          ]),
                          createBaseVNode('section', null, [
                            R[35] ||
                              (R[35] = createBaseVNode(
                                'h3',
                                null,
                                'Board of Directors (BODs)',
                                -1,
                              )),
                            a.bods.length === 0
                              ? (openBlock(),
                                createElementBlock('div', _hoisted_35, 'No BODs listed.'))
                              : createCommentVNode('', !0),
                            (openBlock(!0),
                            createElementBlock(
                              Fragment,
                              null,
                              renderList(
                                a.bods,
                                (Te) => (
                                  openBlock(),
                                  createElementBlock('div', { key: Te.id, class: 'bod-block' }, [
                                    createBaseVNode('div', _hoisted_36, [
                                      createBaseVNode('div', _hoisted_37, [
                                        R[34] ||
                                          (R[34] = createBaseVNode('strong', null, 'Name:', -1)),
                                        createTextVNode(' ' + toDisplayString(Te.name), 1),
                                      ]),
                                    ]),
                                  ])
                                ),
                              ),
                              128,
                            )),
                          ]),
                        ])),
                  ]))
                : createCommentVNode('', !0),
              r.value === 'documents'
                ? (openBlock(),
                  createElementBlock('div', _hoisted_38, [
                    createBaseVNode('div', _hoisted_39, [
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue': R[1] || (R[1] = (Te) => (y.value = Te)),
                            placeholder: 'Filter by Document',
                            class: 'filter-input',
                          },
                          null,
                          512,
                        ),
                        [[vModelText, y.value]],
                      ),
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue': R[2] || (R[2] = (Te) => ($.value = Te)),
                            placeholder: 'Filter by Group',
                            class: 'filter-input',
                          },
                          null,
                          512,
                        ),
                        [[vModelText, $.value]],
                      ),
                      withDirectives(
                        createBaseVNode(
                          'input',
                          {
                            'onUpdate:modelValue': R[3] || (R[3] = (Te) => (_.value = Te)),
                            placeholder: 'Filter by User',
                            class: 'filter-input',
                          },
                          null,
                          512,
                        ),
                        [[vModelText, _.value]],
                      ),
                      createBaseVNode('button', { onClick: P }, 'Apply'),
                    ]),
                    createVNode(
                      DataTable,
                      {
                        data: v.value,
                        columns: F,
                        sort: { column: O.value, order: j.value },
                        onSort: Se,
                      },
                      {
                        actions: withCtx(({ row: Te }) => [
                          createBaseVNode(
                            'a',
                            {
                              href: Te.download_url,
                              target: '_blank',
                              title: 'Download',
                              class: 'action-icon',
                            },
                            [createVNode(D)],
                            8,
                            _hoisted_40,
                          ),
                        ]),
                        _: 1,
                      },
                      8,
                      ['data', 'sort'],
                    ),
                    createBaseVNode('div', _hoisted_41, [
                      createBaseVNode('div', null, [
                        createBaseVNode(
                          'button',
                          {
                            disabled: A.value === 1,
                            onClick: R[4] || (R[4] = (Te) => A.value-- && P()),
                          },
                          'Prev',
                          8,
                          _hoisted_42,
                        ),
                        createBaseVNode(
                          'span',
                          null,
                          'Page ' + toDisplayString(A.value) + ' of ' + toDisplayString(Be.value),
                          1,
                        ),
                        createBaseVNode(
                          'button',
                          {
                            disabled: A.value >= Be.value,
                            onClick: R[5] || (R[5] = (Te) => A.value++ && P()),
                          },
                          'Next',
                          8,
                          _hoisted_43,
                        ),
                      ]),
                      createBaseVNode('div', _hoisted_44, [
                        R[37] || (R[37] = createBaseVNode('label', null, 'Rows per page:', -1)),
                        withDirectives(
                          createBaseVNode(
                            'select',
                            {
                              'onUpdate:modelValue': R[6] || (R[6] = (Te) => (k.value = Te)),
                              onChange: R[7] || (R[7] = (Te) => P()),
                            },
                            R[36] ||
                              (R[36] = [
                                createBaseVNode('option', { value: 10 }, '10', -1),
                                createBaseVNode('option', { value: 25 }, '25', -1),
                                createBaseVNode('option', { value: 50 }, '50', -1),
                              ]),
                            544,
                          ),
                          [[vModelSelect, k.value]],
                        ),
                      ]),
                    ]),
                  ]))
                : createCommentVNode('', !0),
              c.value
                ? (openBlock(),
                  createElementBlock('div', _hoisted_45, [
                    createBaseVNode('div', _hoisted_46, [
                      createBaseVNode(
                        'button',
                        { class: 'close-btn', onClick: R[8] || (R[8] = (Te) => (c.value = !1)) },
                        '×',
                      ),
                      createVNode(
                        FcaForm,
                        {
                          initialData: a,
                          editMode: !0,
                          onClose: R[9] || (R[9] = (Te) => (c.value = !1)),
                          onUpdated: d,
                        },
                        null,
                        8,
                        ['initialData'],
                      ),
                    ]),
                  ]))
                : createCommentVNode('', !0),
            ])
          )
        }
      )
    },
  },
  FcaDataView = _export_sfc(_sfc_main$3, [['__scopeId', 'data-v-b62fdc0e']]),
  _hoisted_1$2 = { class: 'dashboard' },
  _hoisted_2$2 = { key: 0, class: 'loader-center' },
  _hoisted_3$2 = { key: 1 },
  _hoisted_4$1 = { class: 'stat-row' },
  _hoisted_5$1 = { class: 'stat-value' },
  _hoisted_6$1 = { class: 'stat-value' },
  _hoisted_7$1 = { class: 'card' },
  _hoisted_8$1 = { class: 'card-header' },
  _hoisted_9$1 = { class: 'log-table' },
  _sfc_main$2 = {
    __name: 'Dashboard',
    setup(t) {
      const n = useUserStore(),
        o = localStorage.getItem('token'),
        s = ref({}),
        r = ref([]),
        i = useRouter(),
        a = async () => {
          const u = await fetch('https://api-abealcala.duckdns.org/dashboard', {
            headers: { Authorization: `Bearer ${o}` },
          })
          s.value = await u.json()
        },
        c = async () => {
          const u = new URLSearchParams({ page: 1, limit: 10, sort: 'created_at', order: 'desc' }),
            d = await (
              await fetch(`https://api-abealcala.duckdns.org/audit_logs?${u}`, {
                headers: { Authorization: `Bearer ${o}` },
              })
            ).json()
          r.value = d.data
        }
      return (
        onMounted(() => {
          n.fetchMe(), a(), c()
        }),
        (u, g) => {
          const d = resolveComponent('DonutLoader')
          return (
            openBlock(),
            createElementBlock('div', _hoisted_1$2, [
              createVNode(TitleBar, { title: 'Dashboard' }),
              !s.value.total_fcas && !r.value.length
                ? (openBlock(),
                  createElementBlock('div', _hoisted_2$2, [
                    createVNode(d, { color: '#2e7d32', size: '1.5rem', multi: !1 }),
                  ]))
                : (openBlock(),
                  createElementBlock('div', _hoisted_3$2, [
                    createBaseVNode('div', _hoisted_4$1, [
                      createBaseVNode(
                        'button',
                        {
                          class: 'btn btn-green',
                          onClick: g[0] || (g[0] = (v) => unref(i).push('/fca')),
                        },
                        [
                          createVNode(unref(Add20), { class: 'btn-icon' }),
                          g[5] || (g[5] = createTextVNode(' New FCA ')),
                        ],
                      ),
                      createBaseVNode(
                        'button',
                        {
                          class: 'btn btn-blue',
                          onClick: g[1] || (g[1] = (v) => unref(i).push('/generate')),
                        },
                        [
                          createVNode(unref(Add20), { class: 'btn-icon' }),
                          g[6] || (g[6] = createTextVNode(' Generate Document ')),
                        ],
                      ),
                      createBaseVNode(
                        'div',
                        {
                          class: 'stat-card clickable',
                          onClick: g[2] || (g[2] = (v) => unref(i).push('/fcas')),
                        },
                        [
                          g[7] ||
                            (g[7] = createBaseVNode(
                              'div',
                              { class: 'stat-label' },
                              'Total FCAs',
                              -1,
                            )),
                          createBaseVNode('div', _hoisted_5$1, [
                            createTextVNode(toDisplayString(s.value.total_fcas) + ' ', 1),
                            createVNode(unref(ArrowRight20), { class: 'arrow-icon' }),
                          ]),
                        ],
                      ),
                      createBaseVNode(
                        'div',
                        {
                          class: 'stat-card clickable',
                          onClick: g[3] || (g[3] = (v) => unref(i).push('/documents')),
                        },
                        [
                          g[8] ||
                            (g[8] = createBaseVNode(
                              'div',
                              { class: 'stat-label' },
                              'Documents Generated',
                              -1,
                            )),
                          createBaseVNode('div', _hoisted_6$1, [
                            createTextVNode(
                              toDisplayString(s.value.total_generated_documents) + ' ',
                              1,
                            ),
                            createVNode(unref(ArrowRight20), { class: 'arrow-icon' }),
                          ]),
                        ],
                      ),
                    ]),
                    createBaseVNode('div', _hoisted_7$1, [
                      createBaseVNode('div', _hoisted_8$1, [
                        g[9] || (g[9] = createBaseVNode('h2', null, 'Recent Activity', -1)),
                        createBaseVNode(
                          'button',
                          {
                            class: 'view-all',
                            onClick: g[4] || (g[4] = (v) => unref(i).push('/settings/logs')),
                          },
                          'View All',
                        ),
                      ]),
                      createBaseVNode('table', _hoisted_9$1, [
                        g[10] ||
                          (g[10] = createBaseVNode(
                            'thead',
                            null,
                            [
                              createBaseVNode('tr', null, [
                                createBaseVNode('th', null, 'Action'),
                                createBaseVNode('th', null, 'Metadata'),
                                createBaseVNode('th', null, 'User'),
                                createBaseVNode('th', null, 'Date'),
                              ]),
                            ],
                            -1,
                          )),
                        createBaseVNode('tbody', null, [
                          (openBlock(!0),
                          createElementBlock(
                            Fragment,
                            null,
                            renderList(
                              r.value,
                              (v) => (
                                openBlock(),
                                createElementBlock('tr', { key: v.id }, [
                                  createBaseVNode('td', null, toDisplayString(v.action_id), 1),
                                  createBaseVNode('td', null, toDisplayString(v.metadata), 1),
                                  createBaseVNode('td', null, toDisplayString(v.username), 1),
                                  createBaseVNode(
                                    'td',
                                    null,
                                    toDisplayString(new Date(v.created_at).toLocaleString()),
                                    1,
                                  ),
                                ])
                              ),
                            ),
                            128,
                          )),
                        ]),
                      ]),
                    ]),
                  ])),
            ])
          )
        }
      )
    },
  },
  Dashboard = _export_sfc(_sfc_main$2, [['__scopeId', 'data-v-f1539f81']]),
  _hoisted_1$1 = { class: 'settings-container' },
  _hoisted_2$1 = { class: 'tabs' },
  _hoisted_3$1 = { class: 'tab-panel' },
  _sfc_main$1 = {
    __name: 'SettingsView',
    setup(t) {
      const n = useUserStore()
      return (o, s) => {
        const r = resolveComponent('RouterLink'),
          i = resolveComponent('router-view')
        return (
          openBlock(),
          createElementBlock('div', _hoisted_1$1, [
            createVNode(TitleBar, { title: 'Settings', icon: unref(Settings20) }, null, 8, [
              'icon',
            ]),
            createBaseVNode('div', _hoisted_2$1, [
              createVNode(
                r,
                { to: '/settings', class: 'tab-btn', 'exact-active-class': 'active' },
                {
                  default: withCtx(() => s[0] || (s[0] = [createTextVNode('Account')])),
                  _: 1,
                  __: [0],
                },
              ),
              unref(n).user?.is_admin
                ? (openBlock(),
                  createBlock(
                    r,
                    {
                      key: 0,
                      to: '/settings/templates',
                      class: 'tab-btn',
                      'exact-active-class': 'active',
                    },
                    {
                      default: withCtx(() => s[1] || (s[1] = [createTextVNode(' Templates ')])),
                      _: 1,
                      __: [1],
                    },
                  ))
                : createCommentVNode('', !0),
              unref(n).user?.is_admin
                ? (openBlock(),
                  createBlock(
                    r,
                    {
                      key: 1,
                      to: '/settings/users',
                      class: 'tab-btn',
                      'exact-active-class': 'active',
                    },
                    {
                      default: withCtx(() => s[2] || (s[2] = [createTextVNode(' Users ')])),
                      _: 1,
                      __: [2],
                    },
                  ))
                : createCommentVNode('', !0),
              createVNode(
                r,
                { to: '/settings/logs', class: 'tab-btn', 'exact-active-class': 'active' },
                {
                  default: withCtx(() => s[3] || (s[3] = [createTextVNode('Activity Log')])),
                  _: 1,
                  __: [3],
                },
              ),
            ]),
            createBaseVNode('div', _hoisted_3$1, [createVNode(i)]),
          ])
        )
      }
    },
  },
  SettingsView = _export_sfc(_sfc_main$1, [['__scopeId', 'data-v-d53a2243']]),
  _hoisted_1 = { class: 'settings-list' },
  _hoisted_2 = { key: 0, class: 'modal-overlay' },
  _hoisted_3 = { class: 'modal-content' },
  _hoisted_4 = { class: 'form-group' },
  _hoisted_5 = { class: 'form-group' },
  _hoisted_6 = { key: 0, class: 'error' },
  _hoisted_7 = { key: 1, class: 'modal-overlay' },
  _hoisted_8 = { class: 'modal-content' },
  _hoisted_9 = { class: 'form-group' },
  _hoisted_10 = { key: 2, class: 'modal-overlay' },
  _hoisted_11 = { class: 'modal-content' },
  _hoisted_12 = { class: 'form-group' },
  _sfc_main = {
    __name: 'AccountSettings',
    setup(t) {
      const n = localStorage.getItem('token'),
        o = ref({ password: !1, email: !1, name: !1 }),
        s = ref({ new: '', confirm: '' }),
        r = ref({ new: '' }),
        i = ref({ new: '' }),
        a = ref(!1)
      function c(y) {
        u(), (o.value[y] = !0)
      }
      function u() {
        ;(o.value = { password: !1, email: !1, name: !1 }),
          (s.value = { new: '', confirm: '' }),
          (r.value = { new: '' }),
          (i.value = { new: '' }),
          (a.value = !1)
      }
      async function g() {
        if (s.value.new !== s.value.confirm) {
          a.value = !0
          return
        }
        a.value = !1
        const _ = await (
          await fetch('https://api-abealcala.duckdns.org/update_me', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${n}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: s.value.new }),
          })
        ).json()
        alert(_.message || 'Password updated.'), u()
      }
      async function d() {
        const _ = await (
          await fetch('https://api-abealcala.duckdns.org/update_me', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${n}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: r.value.new }),
          })
        ).json()
        alert(_.message || 'Email updated.'), u()
      }
      async function v() {
        const _ = await (
          await fetch('https://api-abealcala.duckdns.org/update_me', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${n}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: i.value.new }),
          })
        ).json()
        alert(_.message || 'Name updated.'), u()
      }
      return (y, _) => (
        openBlock(),
        createElementBlock(
          Fragment,
          null,
          [
            createBaseVNode('ul', _hoisted_1, [
              createBaseVNode(
                'li',
                { onClick: _[0] || (_[0] = ($) => c('password')) },
                _[7] || (_[7] = [createBaseVNode('span', null, 'Change Password', -1)]),
              ),
              createBaseVNode(
                'li',
                { onClick: _[1] || (_[1] = ($) => c('email')) },
                _[8] || (_[8] = [createBaseVNode('span', null, 'Change Email', -1)]),
              ),
              createBaseVNode(
                'li',
                { onClick: _[2] || (_[2] = ($) => c('name')) },
                _[9] || (_[9] = [createBaseVNode('span', null, 'Change Name', -1)]),
              ),
            ]),
            o.value.password
              ? (openBlock(),
                createElementBlock('div', _hoisted_2, [
                  createBaseVNode('div', _hoisted_3, [
                    _[13] || (_[13] = createBaseVNode('h3', null, 'Change Password', -1)),
                    createBaseVNode(
                      'form',
                      { onSubmit: withModifiers(g, ['prevent']) },
                      [
                        createBaseVNode('div', _hoisted_4, [
                          _[10] || (_[10] = createBaseVNode('label', null, 'New Password', -1)),
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                type: 'password',
                                'onUpdate:modelValue': _[3] || (_[3] = ($) => (s.value.new = $)),
                                required: '',
                              },
                              null,
                              512,
                            ),
                            [[vModelText, s.value.new]],
                          ),
                        ]),
                        createBaseVNode('div', _hoisted_5, [
                          _[11] || (_[11] = createBaseVNode('label', null, 'Confirm Password', -1)),
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                type: 'password',
                                'onUpdate:modelValue':
                                  _[4] || (_[4] = ($) => (s.value.confirm = $)),
                                required: '',
                              },
                              null,
                              512,
                            ),
                            [[vModelText, s.value.confirm]],
                          ),
                        ]),
                        a.value
                          ? (openBlock(),
                            createElementBlock('div', _hoisted_6, 'Passwords do not match'))
                          : createCommentVNode('', !0),
                        createBaseVNode('div', { class: 'modal-actions' }, [
                          _[12] ||
                            (_[12] = createBaseVNode(
                              'button',
                              { type: 'submit', class: 'btn-primary' },
                              'Update',
                              -1,
                            )),
                          createBaseVNode(
                            'button',
                            { type: 'button', class: 'btn-secondary', onClick: u },
                            'Cancel',
                          ),
                        ]),
                      ],
                      32,
                    ),
                  ]),
                ]))
              : createCommentVNode('', !0),
            o.value.email
              ? (openBlock(),
                createElementBlock('div', _hoisted_7, [
                  createBaseVNode('div', _hoisted_8, [
                    _[16] || (_[16] = createBaseVNode('h3', null, 'Change Email', -1)),
                    createBaseVNode(
                      'form',
                      { onSubmit: withModifiers(d, ['prevent']) },
                      [
                        createBaseVNode('div', _hoisted_9, [
                          _[14] || (_[14] = createBaseVNode('label', null, 'New Email', -1)),
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                type: 'email',
                                'onUpdate:modelValue': _[5] || (_[5] = ($) => (r.value.new = $)),
                                required: '',
                              },
                              null,
                              512,
                            ),
                            [[vModelText, r.value.new]],
                          ),
                        ]),
                        createBaseVNode('div', { class: 'modal-actions' }, [
                          _[15] ||
                            (_[15] = createBaseVNode(
                              'button',
                              { type: 'submit', class: 'btn-primary' },
                              'Update',
                              -1,
                            )),
                          createBaseVNode(
                            'button',
                            { type: 'button', class: 'btn-secondary', onClick: u },
                            'Cancel',
                          ),
                        ]),
                      ],
                      32,
                    ),
                  ]),
                ]))
              : createCommentVNode('', !0),
            o.value.name
              ? (openBlock(),
                createElementBlock('div', _hoisted_10, [
                  createBaseVNode('div', _hoisted_11, [
                    _[19] || (_[19] = createBaseVNode('h3', null, 'Change Name', -1)),
                    createBaseVNode(
                      'form',
                      { onSubmit: withModifiers(v, ['prevent']) },
                      [
                        createBaseVNode('div', _hoisted_12, [
                          _[17] || (_[17] = createBaseVNode('label', null, 'New Name', -1)),
                          withDirectives(
                            createBaseVNode(
                              'input',
                              {
                                type: 'text',
                                'onUpdate:modelValue': _[6] || (_[6] = ($) => (i.value.new = $)),
                                required: '',
                              },
                              null,
                              512,
                            ),
                            [[vModelText, i.value.new]],
                          ),
                        ]),
                        createBaseVNode('div', { class: 'modal-actions' }, [
                          _[18] ||
                            (_[18] = createBaseVNode(
                              'button',
                              { type: 'submit', class: 'btn-primary' },
                              'Update',
                              -1,
                            )),
                          createBaseVNode(
                            'button',
                            { type: 'button', class: 'btn-secondary', onClick: u },
                            'Cancel',
                          ),
                        ]),
                      ],
                      32,
                    ),
                  ]),
                ]))
              : createCommentVNode('', !0),
          ],
          64,
        )
      )
    },
  },
  AccountSettings = _export_sfc(_sfc_main, [['__scopeId', 'data-v-746395c1']]),
  router = createRouter({
    history: createWebHistory('/'),
    routes: [
      { path: '/login', name: 'login', component: LoginView },
      { path: '/', name: 'home', component: Dashboard },
      { path: '/users', name: 'users', component: UsersView },
      { path: '/preview', name: 'preview', component: PreviewView },
      { path: '/fcas', name: 'fcas', component: FcaView },
      { path: '/fca/:id', name: 'fca-data', component: FcaDataView },
      { path: '/fca', name: 'fca', component: FcaForm },
      { path: '/documents', name: 'documents', component: DocumentView },
      { path: '/settings/document', name: 'document-settings', component: DocumentSettings },
      { path: '/settings/document/:id', name: 'document-schema', component: DocumentSchema },
      {
        path: '/settings',
        component: SettingsView,
        children: [
          { path: '', name: 'AccountSettings', component: AccountSettings },
          { path: 'templates', name: 'TemplatesSettings', component: DocumentSettings },
          { path: 'users', name: 'UsersSettings', component: UsersView },
          { path: 'logs', name: 'LogsSettings', component: AuditLogView },
        ],
      },
      { path: '/generate', name: 'generate', component: DocumentGenerator },
      {
        path: '/about',
        name: 'about',
        component: () =>
          __vitePreload(() => import('./AboutView-Bj9v4g9p.js'), __vite__mapDeps([0, 1])),
      },
    ],
  })
router.beforeEach((t, n, o) => {
  const s = localStorage.getItem('token')
  t.name === 'login' && s
    ? o({ name: 'home' })
    : t.name === 'home' && !s
      ? o({ name: 'login' })
      : o()
})
const app = createApp$1(App)
app.use(CarbonIconsVue, { components: { Bee32 } })
app.component('DonutLoader', DonutLoader)
app.component('v-select', Ce)
app.use(ToastPlugin)
app.use(createPinia())
app.use(router)
app.mount('#app')
export { _export_sfc as _, createBaseVNode as a, createElementBlock as c, openBlock as o }
