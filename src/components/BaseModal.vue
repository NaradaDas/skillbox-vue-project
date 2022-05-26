<template lang="">
  <teleport v-if="open" to="#teleport-target">
    <div :class="{ 'out-content': isOutContent }" class="teleport-blackout"></div>
    <!-- eslint-disable-next-line -->
    <div class="teleport-modal" @click="onOutsideClick">
        <!-- eslint-disable-next-line -->
      <div
        ref="contentElement"
        @mouseleave="isOutContent = true"
        @mouseenter="isOutContent = false"
        class="teleport-modal__content"
      >
        <slot></slot>
        <button type="button" class="teleport-modal__close close" @click="doClose">
          <svg width="20" height="20" fill="currentColor">
            <g id="color" />
            <g id="hair" />
            <g id="skin" />
            <g id="skin-shadow" />
            <g id="line">
              <line
                x1="0"
                x2="20"
                y1="0"
                y2="20"
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="10"
                stroke-width="2"
              />
              <line
                x1="20"
                x2="0"
                y1="0"
                y2="20"
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="10"
                stroke-width="2"
              />
            </g>
          </svg>
        </button>
      </div>
    </div>
  </teleport>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';
import useModal from '@/composible/useModal';

export default defineComponent({
  props: {
    open: { type: Boolean },
  },
  setup(props, { emit: $emit }) {
    const contentElement = ref(null);

    const { doOpen, doClose } = useModal();

    const isOutContent = ref(true);

    const doCloseModal = () => {
      $emit('update:open', false);
      doClose();
    };

    const onOutsideClick = ($event) => {
      if ($event.target !== contentElement.value && $event.target.contains(contentElement.value)) {
        doCloseModal();
      }
    };

    watch(
      () => props.open,
      (isOpen) => {
        if (isOpen) {
          doOpen();
        } else {
          doCloseModal();
        }
      },
      { immediate: true },
    );

    return {
      isOutContent,
      onOutsideClick,
      doClose: doCloseModal,
      contentElement,
    };
  },
});
</script>
<style>
.teleport-blackout {
  z-index: 1010;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.75;
  background-color: #000;
  transition: opacity 0.2s ease-in-out;
}

.out-content {
  opacity: 0.85;
}

.teleport-modal {
  cursor: pointer;

  z-index: 1010;
  overflow: auto;
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  padding: 20px;
  transform: translatex(-50%);
}

.teleport-modal__content {
  z-index: 1011;
  cursor: auto;
  position: relative;
  margin-top: auto;
  margin-bottom: auto;
  padding: 40px;
  background-color: #fff;
}

.close {
  z-index: 100;
  top: 1.25em;
  right: 1.25em;
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: absolute;
  border-color: transparent;
  background-color: transparent;
}

.close svg {
  position: absolute;
  top: -2px;
  right: 0;
  bottom: 0;
  left: -2px;
}

.close::after {
  z-index: -1;
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  bottom: -10px;
  left: -10px;
  background-color: #e02d71;
  border-radius: 50px;
  transition: transform 0.2s ease-in-out;
  transform: scale(0);
}

.close:hover:after {
  transform: scale(1);
}

.close #line line {
  z-index: 100;
  transition: stroke 0.2s ease-in-out;
}

.close:hover #line line {
  stroke: white;
}

.close:active:after {
  transform: scale(0);
}

.close:active #line line {
  stroke: #000;
  transition-duration: 0;
}
</style>
