package com.hq.bm.utils;

import java.lang.reflect.Method;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.hq.bm.entity.User;
import com.hq.bm.service.ILogInfoService;


/**
 * 系统日志AOP
 * @author Administrator
 *
 */
@Aspect
public class SystemLogAspect {

    @Autowired
    private ILogInfoService logInfoService;

    /**
     * 添加业务逻辑方法切入点  ||
     */
    @Pointcut("execution(* com.hq.bm.restful.*.insert*(..))")
    public void insertCell(){}

    @Pointcut("execution (* com.hq.bm.service.*.save*(..))")
    public void saveCell(){}

    /**
     * 修改业务逻辑方法切入点 execution(* com.hq.bm.restful.*.update*(..)) ||
     */
    @Pointcut("execution(* com.hq.bm.service.*.update*(..))")
    public void updateCell(){}

    /**
     * 删除业务逻辑方法切入点
     */
    @Pointcut("execution(* com.hq.bm.service.*.delete*(..))")
    public void deleteCell(){}

    /**
     * 删除业务逻辑方法切入点
     */
    @Pointcut("execution(* com.hq.bm.restful.*.login*(..))")
    public void loginCell(){}

    /**
     * 添加操作日志(后置通知)
     * @param joinPoint
     * @param rtv
     */
    @SuppressWarnings("unused")
    @AfterReturning(value="insertCell()",argNames= "joinPoint,rtv", returning="rtv")
    public void insertLog(JoinPoint joinPoint, Object rtv) throws Throwable{
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        HttpSession session = request.getSession();
        //读取session中的用户
        User user = (User) session.getAttribute("loginUser");
        //请求的IP
        String ip = request.getRemoteAddr();
        if(user == null){//没有管理员登录
            return ;
        }
        //判断参数
        if(joinPoint.getArgs() == null){//没有参数
            return ;
        }
        //获取方法名
        String methodName = joinPoint.getSignature().getName();
        //获取操作内容
        String opContent = optionContent(joinPoint.getArgs(),methodName);
        String targetName = joinPoint.getTarget().getClass().getName();
        Object[] arguments = joinPoint.getArgs();
        Class targetClass = Class.forName(targetName);
        Method[] methods = targetClass.getMethods();
        String operationType = "";
        String operationName = "";
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                Class[] clazzs = method.getParameterTypes();
                if (clazzs.length == arguments.length) {
                    operationType = method.getAnnotation(Log.class).operationType();
                    operationName = method.getAnnotation(Log.class).operationName();
                    break;
                }
            }
        }
//        LogInfo log = new LogInfo();
//        log.setUserId(Integer.parseInt(user.getId()));
//        log.setOpTime(new Date());
//        log.setOpPlatform(user.getOpPlatform());
//        log.setModName(operationType);
//        log.setOpIp(ip);
//        log.setOpDesc("添加一条数据：["+operationType+opContent+"]");
//        log.setRemark("");
//        //保存数据库
//        logInfoService.add(log);
        return;
    }

    /**
     * 添加操作日志(后置通知)
     * @param joinPoint
     * @param rtv
     */
    @SuppressWarnings("unused")
    @AfterReturning(value="saveCell()",argNames= "joinPoint,rtv", returning="rtv")
    public void saveLog(JoinPoint joinPoint, Object rtv) throws Throwable{
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        HttpSession session = request.getSession();
        //读取session中的用户
        User user = (User) session.getAttribute("loginUser");
        //请求的IP
        String ip = request.getRemoteAddr();
        if(user == null){//没有管理员登录
            return ;
        }
        //判断参数
        if(joinPoint.getArgs() == null){//没有参数
            return ;
        }
        //获取方法名
        String methodName = joinPoint.getSignature().getName();
        //获取操作内容
        String opContent = optionContent(joinPoint.getArgs(),methodName);
        String targetName = joinPoint.getTarget().getClass().getName();
        Object[] arguments = joinPoint.getArgs();
        Class targetClass = Class.forName(targetName);
        Method[] methods = targetClass.getMethods();
        String operationType = "";
        String operationName = "";
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                Class[] clazzs = method.getParameterTypes();
                if (clazzs.length == arguments.length) {
                    operationType = method.getAnnotation(Log.class).operationType();
                    operationName = method.getAnnotation(Log.class).operationName();
                    break;
                }
            }
        }
//        LogInfo log = new LogInfo();
//        log.setUserId(Integer.parseInt(user.getId()));
//        log.setOpTime(new Date());
//        log.setOpPlatform(user.getOpPlatform());
//        log.setModName(operationType);
//        log.setOpIp(ip);
//        log.setOpDesc("添加一条数据：["+operationType+opContent+"]");
//        log.setRemark("");
//        //保存数据库
//        logInfoService.add(log);
        return;
    }

    /**
     * 管理员修改操作日志(后置通知)
     * @param joinPoint
     * @param rtv
     * @throws Throwable
     */
    @SuppressWarnings("unused")
    @AfterReturning(value="updateCell()", argNames= "joinPoint,rtv", returning="rtv")
    public void updateLog(JoinPoint joinPoint, Object rtv) throws Throwable{
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        HttpSession session = request.getSession();
        //读取session中的用户
        User user = (User) session.getAttribute("loginUser");
        //请求的IP
        String ip = request.getRemoteAddr();
        if(user == null){//没有登录
            return;
        }
        //判断参数
        if(joinPoint.getArgs() == null){//没有参数
            return;
        }
        //获取方法名
        String methodName = joinPoint.getSignature().getName();
        //获取操作内容
        String opContent = optionContent(joinPoint.getArgs(), methodName);

        String targetName = joinPoint.getTarget().getClass().getName();
        Object[] arguments = joinPoint.getArgs();
        Class targetClass = Class.forName(targetName);
        Method[] methods = targetClass.getMethods();
        String operationType = "";
        String operationName = "";
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                Class[] clazzs = method.getParameterTypes();
                if (clazzs.length == arguments.length) {
                        operationType = method.getAnnotation(Log.class).operationType();
                        operationName = method.getAnnotation(Log.class).operationName();
                        break;
                }
            }
        }

//        LogInfo log = new LogInfo();
//        log.setUserId(Integer.parseInt(user.getId()));
//        log.setOpTime(new Date());
//        log.setOpPlatform(user.getOpPlatform());
//        log.setModName(operationType);
//        log.setOpIp(ip);
//        log.setOpDesc("更新一条数据：["+operationName+opContent+"]");
//        log.setRemark("");
//        //保存数据库
//        logInfoService.add(log);
        return;
    }

    /**
     * 删除操作
     * @param joinPoint
     * @param rtv
     */
    @SuppressWarnings("unused")
    @AfterReturning(value="deleteCell()",argNames= "joinPoint,rtv", returning="rtv")
    public void deleteLog(JoinPoint joinPoint, Object rtv) throws Throwable{
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        HttpSession session = request.getSession();
        //读取session中的用户
        User user = (User) session.getAttribute("loginUser");
        //请求的IP
        String ip = request.getRemoteAddr();
        if(user == null){//没有登录
            return;
        }
        //判断参数
        if(joinPoint.getArgs() == null){//没有参数
            return;
        }
        //获取方法名
        String methodName = joinPoint.getSignature().getName();

        String targetName = joinPoint.getTarget().getClass().getName();
        Object[] arguments = joinPoint.getArgs();
        Class targetClass = Class.forName(targetName);
        Method[] methods = targetClass.getMethods();
        String operationType = "";
        String operationName = "";
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                Class[] clazzs = method.getParameterTypes();
                if (clazzs.length == arguments.length) {
                    operationType = method.getAnnotation(Log.class).operationType();
                    operationName = method.getAnnotation(Log.class).operationName();
                    break;
                }
            }
        }
        StringBuffer rs = new StringBuffer();
//        rs.append(methodName);
        String className = null;
        for(Object info : joinPoint.getArgs()){
            //获取对象类型
//            className = info.getClass().getName();
//            className = className.substring(className.lastIndexOf(".") + 1);
            rs.append("值:(id:" + joinPoint.getArgs()[0]+")");
        }

//        LogInfo log = new LogInfo();
//        log.setUserId(Integer.parseInt(user.getId()));
//        log.setOpTime(new Date());
//        log.setOpPlatform(user.getOpPlatform());
//        log.setModName(operationType);
//        log.setOpIp(ip);
//        log.setOpDesc("删除操作：["+operationName+","+rs.toString()+"]");
//        log.setRemark("");
//        logInfoService.add(log);
        return;
    }

    /**
     * 添加操作日志(后置通知)
     * @param joinPoint
     * @param rtv
     */
    @SuppressWarnings("unused")
    @AfterReturning(value="loginCell()",argNames= "joinPoint,rtv", returning="rtv")
    public void loginLog(JoinPoint joinPoint, Object rtv) throws Throwable{
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        HttpSession session = request.getSession();
        //读取session中的用户
        User user = (User) session.getAttribute("loginUser");
        //请求的IP
        String ip = request.getRemoteAddr();
        if(user == null){//没有管理员登录
            return ;
        }
        //判断参数
        if(joinPoint.getArgs() == null){//没有参数
            return ;
        }
        //获取方法名
        String methodName = joinPoint.getSignature().getName();
        //获取操作内容
        String opContent = optionContent(joinPoint.getArgs(),methodName);
        String targetName = joinPoint.getTarget().getClass().getName();
        Object[] arguments = joinPoint.getArgs();
        Class targetClass = Class.forName(targetName);
        Method[] methods = targetClass.getMethods();
        String operationType = "";
//        String operationName = "";
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                Class[] clazzs = method.getParameterTypes();
                if (clazzs.length == arguments.length) {
                    operationType = method.getAnnotation(Log.class).operationType();
//                    operationName = method.getAnnotation(Log.class).operationName();
                    break;
                }
            }
        }
//        LogInfo log = new LogInfo();
//        log.setUserId(Integer.parseInt(user.getId()));
//        log.setOpTime(new Date());
//        log.setOpPlatform(user.getOpPlatform());
//        log.setModName(operationType);
//        log.setOpIp(ip);
//        log.setOpDesc("用户名："+user.getLoginName()+"，登陆信息："+opContent);
//        log.setRemark("");
//        //保存数据库
//        logInfoService.add(log);
        return;
    }

    /**
     * 使用Java反射来获取被拦截方法(insert、update)的参数值，
     * 将参数值拼接为操作内容
     * @param args
     * @param mName
     * @return
     */
    public String optionContent(Object[] args, String mName){
        if(args == null){
            return null;
        }
        StringBuffer rs = new StringBuffer();
        String className = null;
        int index = 1;
        //遍历参数对象
        for(Object info : args){
            rs.append(info);
            index ++;
        }
        return rs.toString();
    }

}