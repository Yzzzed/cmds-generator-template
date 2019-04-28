/*
 * @Author: Yzed 
 * @Date: 2019-03-08 20:13:40 
 * @Last Modified by: Yzed
 * @Last Modified time: 2019-03-09 09:24:04
 */

import './pagination.css'
import templatePagination from './pagination.string'
import _mm from '../mm'

const Pagination = function(){

    const _this = this

    this.defaultOption = {
        container       : null,
        pageNum         : 1,
        pageRange       : 3,
        onSelectPage    : null
    }
    //事件代理
    $(document).on('click', '.pg-item', function(){
        let $this = $(this)
        if($this.hasClass('active') || $this.hasClass('disabled')){
            return
        }
        typeof _this.option.onSelectPage === 'function' ? _this.option.onSelectPage($this.data('value')) : null
    })
}
//渲染分页组件
Pagination.prototype.render = function(userOption){
    //合并option
    this.option = $.extend({}, this.defaultOption,userOption)
    //判断容器是否为合法的jquery对象
    if(!(this.option.container instanceof jQuery)){
        return
    }
    //判断是否只有一页
    if(this.option.pages <= 1){
        return
    }
    //渲染分页内容
    this.option.container.html(this.getPaginationHtml())
}

//获取分页的html
Pagination.prototype.getPaginationHtml = function(){
    let html = '',
        option = this.option,
        pageArray = [],
        start = option.pageNum - option.pageRange > 0 ?  option.pageNum - option.pageRange : 1,
        end = option.pageNum + option.pageRange < option.pages ? option.pageNum + option.pageRange : option.pages
    //上一页
    pageArray.push({
        name        : '上一页',
        value       : option.prePage,
        disabled    : !option.hasPreviousPage
    })
    //数字按钮的处理
    for(let i = start; i <= end; i++){
        pageArray.push({
            name    : i,
            value   : i,
            active  : (i === option.pageNum)
        })
    }
    //下一页
    pageArray.push({
        name        : '下一页',
        value       : this.option.nextPage,
        disabled    : !this.option.hasNextPage
    })
    
    html = _mm.renderHtml(templatePagination, {
        pageArray : pageArray,
        pageNum   : option.pageNum,
        pages     : option.pages
    })

    return html
}

export default Pagination