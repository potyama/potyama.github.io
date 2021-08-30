    function calc(elem, jun, high, gr, ex_elem, ex_juni, ex_high, ex_salary, gr_per_hour, h_per_hour, sj_per_hour, ad_salary, ad_per_hour) {
        //通常
        const ele_val = document.getElementById('first').value = Math.round(elem * (sj_per_hour * 0.75));
        const jun_val = document.getElementById('second').value = Math.round(jun * (sj_per_hour * 1.5));
        const high_val = document.getElementById('third').value = Math.round(high * (h_per_hour * 1.5));
        const gr_val = document.getElementById('fourth').value = Math.round(gr * gr_per_hour);
        const ad_normal_val = document.getElementById('ad_normal').value = (Math.ceil(((ad_salary * 5)/60)*100)/100 )* 930;
        //講習
        const ex_ele_val = document.getElementById('fifth').value = Math.round(ex_elem * (sj_per_hour * 0.75));
        const ex_jun_val = document.getElementById('sixth').value = Math.round(ex_juni * (sj_per_hour * 1.5));
        const ex_high_val = document.getElementById('seventh').value = Math.round(ex_high * (h_per_hour * 1.5));
        const ad_ex_val = document.getElementById('ad_ex').value =  (Math.ceil(((ad_salary * 5)/60)*100)/100 )* 930;
        //それぞれの合計
        const no_total_val = document.getElementById('no_total').value = Math.round(ele_val + jun_val + high_val + gr_val + ad_normal_val);
        const ad_total_val = document.getElementById('ad_total').value = Math.round(ex_ele_val + ex_jun_val + ex_high_val + ad_ex_val);
        const total_val = document.getElementById('total').value = Math.round(no_total_val+ad_total_val);
    }
