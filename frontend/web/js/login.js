
new Vue({
    el: '#login',
    data: function() {
        return {
            info: {"password":"root1234","studentNumber":"16211000"},
            role:'学生'
        }
    },

    methods: {
        currRole(selVal){
            this.role=selVal;
            console.log(this.role);

        },
        studentLogin(){
            var _self=this;
            console.log(_self.info.password);
            console.log(_self.role);


            $.ajax({
                url: "http://58.87.72.138:30000/studentLogin",
                type: "get",
                dataType: 'json',
                contentType:"application/json",
                data: {
                    info: JSON.stringify(_self.info),
                },
                success: function(res){
                    console.log(res);
                    if(res.err == false){

                        sessionStorage.setItem('stuId',res.data.studentNumber);
                        sessionStorage.setItem('username',res.data.username);
                        _self.$message({
                            message: 'Hi	' + res.data.username,
                            type: 'success',
                            center: true
                        });

                        setTimeout(() => {
                            window.location.href="../index.html";
                        }, 1000);
                    }
                    else{
                        _self.$message({
                            message: '用户名或密码错误',
                            type: 'error',
                            center: true
                        });
                    }

                },
                error: function(err){
                    console.log(err);
                }

            })
        },
        expertLogin(){
            var _self=this;
            console.log(_self.info.password);
            console.log(_self.role);


            $.ajax({
                url: "http://58.87.72.138:30000/studentLogin",
                type: "get",
                dataType: 'json',
                contentType:"application/json",
                data: {
                    info: JSON.stringify(_self.info),
                },
                success: function(res){
                    console.log(res);
                    if(res.err == false){

                        sessionStorage.setItem('stuId',res.data.studentNumber);
                        sessionStorage.setItem('username',res.data.username);
                        _self.$message({
                            message: 'Hi	' + res.data.username,
                            type: 'success',
                            center: true
                        });

                        setTimeout(() => {
                            window.location.href="../index.html";
                        }, 1000);
                    }
                    else{
                        _self.$message({
                            message: '用户名或密码错误',
                            type: 'error',
                            center: true
                        });
                    }

                },
                error: function(err){
                    console.log(err);
                }

            })
        },
        twLogin(){
            var _self=this;
            console.log(_self.info.password);
            console.log(_self.role);


            $.ajax({
                url: "http://58.87.72.138:30000/studentLogin",
                type: "get",
                dataType: 'json',
                contentType:"application/json",
                data: {
                    info: JSON.stringify(_self.info),
                },
                success: function(res){
                    console.log(res);
                    if(res.err == false){

                        sessionStorage.setItem('stuId',res.data.studentNumber);
                        sessionStorage.setItem('username',res.data.username);
                        _self.$message({
                            message: 'Hi	' + res.data.username,
                            type: 'success',
                            center: true
                        });

                        setTimeout(() => {
                            window.location.href="../index.html";
                        }, 1000);
                    }
                    else{
                        _self.$message({
                            message: '用户名或密码错误',
                            type: 'error',
                            center: true
                        });
                    }

                },
                error: function(err){
                    console.log(err);
                }

            })
        },
    }
})