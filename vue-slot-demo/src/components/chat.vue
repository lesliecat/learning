<template>
  <div class="chat">
    <header>
      <van-nav-bar
        title="我的客服"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      />
    </header>

    <!-- 发送内容部分 -->
    <div
      class="chat-content"
      ref="chatContent"
    >
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh"
      >
        <ul class="message-list clearfix">
          <li
            class="clearfix"
            v-for="(msg,index) of messages"
            :class="{'others': msg.from === 'ai', 'mine': msg.from !== 'ai'}"
            :key="index"
          >
            <p class="date">{{ msg.date }}</p>
            <p class="info">
              <!-- <span class="portrait">
              <img :src="msg.portrait">
            </span> -->
              <span class="nickname">{{ msg.nickname }}</span>
            </p>
            <p
              class="content"
              v-html="msg.content"
            ></p>
          </li>
        </ul>
      </van-pull-refresh>
    </div>

    <!-- 底部 -->
    <footer class="chat-footer">
      <div class="foot-handle clearfix">
        <div class="left fl">
          <van-icon name="service-o" />
        </div>
        <div class="center fl">
          <van-cell-group>
            <van-field
              v-model="inputText"
              placeholder="请输入发送内容"
              @keyup.enter="send"
            />
          </van-cell-group>
        </div>
        <div class="right fr">
          <!-- 表情 -->
          <van-icon
            name="smile-o"
            @click="emojiShow = !emojiShow"
          />
          <!-- 发送按钮 -->
          <van-button
            type="primary"
            @click="send"
          >发送</van-button>
        </div>
      </div>
      <!-- 表情 -->
      <div class="emoji">
        <div
          class="emoji-wraper"
          v-show="emojiShow"
        >
          <ul class="clearfix">
            <li
              v-for="(item,index) in emoji"
              :key="index"
              @click="inputEmoji(item)"
            >{{item}}</li>
          </ul>
        </div>
      </div>
    </footer>

  </div>

</template>

<script>
export default {
  data () {
    return {
      isLoading: false,
      messages: [],
      yonghu: "",
      inputText: '',
      nickname: '',
      portrait: '',
      emojiShow: false,
      emoji: ['😃', '😁', '😂', '😧', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😙', '😚', '🙂', '🤗', '😭', '🤔', '😳', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😟', '😝', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '🙁', '😖', '😞', '😟', '😤', '😢', '😦'
      ],

      historyId: 99999,
    }
  },
  beforeRouterEnter (to, from, next) {
    if (!localStorage.nickname) {
      next('/')
    } else {
      next()
    }
  },
  created () {
    this.nickname = this.$store.state.nickname
    this.portrait = this.$store.state.portrait

    if (localStorage.record_ai) {
      this.messages = JSON.parse(localStorage.record_ai)
      // console.log(this.messages);
      return
    }

    this.getHistory()

    let that = this
    window.addEventListener('scroll', function() {

    })

  },
  updated () {
    // this.$nextTick(() => {
    //   this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight

    // })

  },
  methods: {
    onClickLeft () {
      this.$router.go(-1);//返回上一层
      var storage = window.localStorage;
      storage.clear()

    },
    onClickRight () {
      alert('按钮');
    },
    onRefresh () {
      setTimeout(() => {
        this.isLoading = false;
        this.getHistory();
      }, 500);

    },
    //是否还有历史数据
    hasHistory () {
      let pass = true;//默认是有历史数据的
      if (this.historyId <= 0) {
        pass = false;
      }
      //这里如果是机器人 或者没有登录  pass都是false  那么就不会执行获取历史记录了
      return pass;
    },
    //初始化调用一次  每一次下拉都调用这个函数就好了
    getHistory () {
      if (!this.hasHistory()) {
        return;
      }
      let that = this
      that.axios.post('/api/getHistoryChat', {
        "userName": that.nickname,
        "id": this.historyId,
        "count": 10
      }).then(res => {
        let data = res.data || [];
        this.historyId = data.length ? data[0].id : 0;//如果有数据  那么就是第0条数据的ID 因为第0条数据是最小的 如果没有数据了的话 那么这个ID就是0了 下次就不会请求了
        console.log(res.data);


        if (data.length) {
          this.messages.unshift(...data)
        }
        return;
      })

    },
    inputEmoji (emoji) {
      this.inputText += emoji
      this.emojiShow = false
      console.log(this.inputText);
    },
    //点击发送按钮
    send () {
      let that = this
      this.emojiShow = false;
      if (this.inputText === '') {
        this.$toast("请输入发送内容");
        return false;
      } else {
        // 智能机器人应答的接口
        let url = '/api/getBotMsg'
        // let url = '/static/json/robot.json'
        let data = {
          "msg": this.inputText,
          "userName": this.nickname
        }
        this.pushMine()
        that.axios.post('/api/getBotMsg', {
          "msg": this.inputText,
          "userName": this.nickname
        }).then(res => {
          this.pushAI(res.data)

        })
        this.inputText = ''
      }
    },
    // 展示用户发送的消息
    pushMine () {
      this.messages.push({
        from: 'mine',
        date: this.getTime(),
        nickname: this.nickname,
        portrait: this.portrait,
        content: this.inputText
      })
    },

    // 展示AI机器人发送的消息
    pushAI (results) {
      let message = {
        from: 'ai',
        date: this.getTime(),
        nickname: '智能助手',
        portrait: '/static/images/img01.jpg'
      }
      console.log(results);

      if (!results.length) {
        message.content = '这个问题可难倒我了'
        this.messages.push(message)
        return
      } else {
        this.messages.push(message)
        message.content = results
      }
    },
    // 获取时间
    getTime () {
      return this.moment().format('MM-DD HH:mm')
    },
  },
  computed: {
    clickable () {
      return this.inputText.length > 0
    }
  },
  watch: {
    messages: {
      handler () {
        localStorage.record_ai = JSON.stringify(this.messages)
      },
      deep: true
    }
  }
}
</script>

<style lang='scss'>
@import '../../style/_Chat.scss';
</style>


