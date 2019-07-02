<%@page import="java.net.NetworkInterface"%>
<%@page import="java.net.InetAddress"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.iptv.epg.store.*" %>
<%@ page import="com.iptv.epg.util.*" %>
<%@ page import="com.iptv.epg.constant.*" %>
<%@ page import="com.iptv.epg.vo.*" %>

<%@ page import="com.dr.iptv.msg.req.act.*"%>
<%@ page import="com.dr.iptv.msg.res.act.*"%>

<%@ page import="com.dr.iptv.msg.vo.*"%>
<%@ page import="com.dr.iptv.sdk.act.constant.*"%>
<%@ page import="com.dr.iptv.sdk.act.process.*"%>
<%@ page import="com.dr.iptv.util.*" %>
<%@ page import="java.io.*"%>
<%@ page import="java.net.URLEncoder"%>
<%@ page import="java.net.URLDecoder"%>
<%@ include file="act_constant.jsp"%>
<%!
		
 	//新版抽奖（普通方式）
	public LotteryResponse lottery(String userId,String actCode) {
		ActCoinProcess process = new ActCoinProcess(API_URL);
		LotteryRequest req = new LotteryRequest();
		req.setUserId(userId);
		req.setActCode(actCode);
		return process.lotteryCoin(req);
	}

	//查询中奖信息
	public WinInfoGetResponse getWinInfos(String userId, String actCode, int count) {
		ActCoinProcess process = new ActCoinProcess(API_URL);
		WinInfoCoinGetRequest req = new WinInfoCoinGetRequest();
		req.setUserId(userId);
		req.setActCode(actCode);
		req.setCount(count);
		return process.getWinInfo(req);
	}
	
	//查询用户抽奖相关信息
	public LotteryInfoGetResponse getLotteryInfo(String project,String actCode,String userId,int orderStatus){
		ActivityProcess  process = new ActivityProcess(API_URL);
		LotteryInfoGetRequest  req = new LotteryInfoGetRequest();
		req.setProject(project);
		req.setActCode(actCode);
		req.setUserId(userId);
		req.setOrderStatus(orderStatus);	
		return process.getLotteryInfo(req);
	}
	
	//查询荣誉值排行榜
	public RichUserGetResponse getRichUser(String actCode,int count){
		ActCoinProcess process = new ActCoinProcess(API_URL);
		RichUserGetRequest req =  new RichUserGetRequest();
		req.setActCode(actCode);
		req.setCount(count);
		
		return process.getRichUser(req);
	} 
	
	//增加金币
	public CoinAddResponse addCoin(String userId,String actCode,int coins){
		ActCoinProcess process = new ActCoinProcess(API_URL);
		CoinAddRequest req = new CoinAddRequest();
		req.setUserId(userId);
		req.setActCode(actCode);
		req.setCoins(coins);
		
		return process.addCoin(req);
	}
	
	//获取用户活动信息接口
	public  UserActInfoGetResponse  getUserActInfo(String userId,String actCode,int orderNum){
		ActCoinProcess process = new ActCoinProcess(API_URL);
		UserActInfoGetRequest  req = new UserActInfoGetRequest();
		req.setUserId(userId);
		req.setActCode(actCode);
		req.setOrderNum(orderNum);
		
		return process.getUserActInfo(req);
	 }

	//新版添加联系方式（针对添加联系方式）
	public ContactsAddResponse addContacts(String userId, String actCode, String tel, String qq){
		ActCoinProcess process = new ActCoinProcess(API_URL);
		ContactsAddRequest req = new ContactsAddRequest();
		req.setUserId(userId);
		req.setActCode(actCode);
		req.setTel(tel);
		req.setQq(qq);
		
		return process.addContacts(req);
	}
	
	//填写用户手机号
	public TelAddResponse addTel(String recId,String tel){
		LotteryProcess process = new LotteryProcess(API_URL);
		TelAddRequest  req = new TelAddRequest();
		req.setRecId(recId);
		req.setTel(tel);
		return process.addTel(req);
	}
	
	//获取产品访问有效荣誉值
	public ValidCoinGetResponse getValidCoin(String userId,String actCode,int watchCoin,int maxCoin){
		ActCoinProcess process = new ActCoinProcess(API_URL);
		ValidCoinGetRequest req = new ValidCoinGetRequest();
		req.setActCode(actCode);
		req.setUserId(userId);
		req.setWatchCoin(watchCoin);
		req.setMaxCoin(maxCoin);
		
		return process.getValidCoin(req);
	}
	
	public String getIpAddr(HttpServletRequest request) throws Exception {    
        String ip = request.getHeader("x-forwarded-for");    
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {    
            ip = request.getHeader("Proxy-Client-IP");    
        }    
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {    
            ip = request.getHeader("WL-Proxy-Client-IP");    
        }    
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {    
            ip = request.getHeader("HTTP_CLIENT_IP");    
        }    
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {    
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");    
        }    
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {    
            ip = request.getRemoteAddr();    
        }    
        return ip;    
    }   
	
	public String getMACAddress(String ip) throws Exception {    
        String line = "";    
        String macAddress = "";    
        final String MAC_ADDRESS_PREFIX = "MAC Address = ";    
        final String LOOPBACK_ADDRESS = "127.0.0.1";    
        //如果为127.0.0.1,则获取本地MAC地址。    
        if (LOOPBACK_ADDRESS.equals(ip)) {    
            InetAddress inetAddress = InetAddress.getLocalHost();    
            //貌似此方法需要JDK1.6
            byte[] mac = NetworkInterface.getByInetAddress(inetAddress).getHardwareAddress();    
            //下面代码是把mac地址拼装成String    
            StringBuilder sb = new StringBuilder();    
            for (int i = 0; i < mac.length; i++) {    
                if (i != 0) {    
                    sb.append("-");    
                }    
                //mac[i] & 0xFF 是为了把byte转化为正整数    
                String s = Integer.toHexString(mac[i] & 0xFF);    
                sb.append(s.length() == 1 ? 0 + s : s);    
            }    
            //把字符串所有小写字母改为大写成为正规的mac地址并返回    
            macAddress = sb.toString().trim().toUpperCase();    
            return macAddress;    
        }    
        //获取非本地IP的MAC地址    
        try {    
            Process p = Runtime.getRuntime().exec("nbtstat -A " + ip);    
            InputStreamReader isr = new InputStreamReader(p.getInputStream());    
            BufferedReader br = new BufferedReader(isr);    
            while ((line = br.readLine()) != null) {    
                if (line != null) {    
                    int index = line.indexOf(MAC_ADDRESS_PREFIX);    
                    if (index != -1) {    
                        macAddress = line.substring(index + MAC_ADDRESS_PREFIX.length()).trim().toUpperCase();    
                    }    
                }    
            }    
            br.close();    
        } catch (IOException e) {    
            e.printStackTrace(System.out);    
        }    
        return macAddress;    
    }
	
	//投票(*亲子照)
	public VoteResponse lottery(String actCode, String number, String userId){
		ActVoteProcess process = new ActVoteProcess(API_URL);
		VoteRequest req = new VoteRequest();
		req.setActCode(actCode);
		req.setNumber(number);
		req.setUserId(userId);
		return process.lottery(req);
	}

	//投票信息列表查询(*亲子照)
	public VoteInfoGetResponse getUserActInfo(String actCode,int cur,int pageSize){
		ActVoteProcess process = new ActVoteProcess(API_URL);
		VoteInfoGetRequest req = new VoteInfoGetRequest();
		req.setActCode(actCode);
		req.setCur(cur);
		req.setPageSize(pageSize);
		return process.getVoteInfo(req);
	}

	//获取用户活动信息接口(*亲子照)
	public UserActInfoGetResponse getUserActInfo(String actCode, int orderNum, String userId) {
		ActVoteProcess process = new ActVoteProcess(API_URL);
		UserActInfoGetRequest req = new UserActInfoGetRequest();
		req.setActCode(actCode);
		req.setOrderNum(orderNum);
		req.setUserId(userId);
		return process.getUserActInfo(req);
		}
%>