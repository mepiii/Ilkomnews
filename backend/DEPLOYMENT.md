# ILKOM NEWS - Deployment Guide

## Performance Optimization Commands

After deploying to production, run these optimization commands:

### Laravel Cache Optimization

```bash
# Cache configuration files
php artisan config:cache

# Cache routes (significant performance improvement)
php artisan route:cache

# Cache Blade views
php artisan view:cache

# Run all optimizations at once
php artisan optimize
```

### Cache Management

```bash
# Clear all caches (useful during development)
php artisan optimize:clear

# Clear specific caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

### Production Optimization Checklist

- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`
- [ ] Verify `.env` has `APP_ENV=production`
- [ ] Verify `.env` has `APP_DEBUG=false`
- [ ] Enable OPcache in `php.ini`
- [ ] Configure Redis for caching (if available)
- [ ] Set up queue workers for background jobs

### OPcache Configuration

Add to `php.ini`:

```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
```

### Redis Configuration

If using Redis for caching, update `.env`:

```env
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Database Optimization

Verify indexes are in place:

```bash
# Check migrations for proper indexes
php artisan migrate:status

# Key indexes should exist on:
# - news: status, published_at, slug
# - articles: status, category, date
# - events: status, start_date, end_date
# - careers: status, position_type, published_at
# - project_submissions: status, user_id
```

### Frontend Build Optimization

```bash
# Build for production (from project root)
cd frontend
npm run build

# Verify build output
ls -lh dist/assets/
```

Frontend optimizations applied:
- ✅ Code splitting via Vite
- ✅ Lazy loading images (`loading="lazy"`)
- ✅ Asset minification
- ✅ Tree shaking
- ✅ CSS extraction

### Performance Monitoring

After deployment, monitor:

1. **Page Load Times**: Should be < 2s
2. **API Response Times**: Should be < 200ms
3. **Database Query Count**: Watch for N+1 queries
4. **Memory Usage**: Laravel should use ~50-100MB per request

### Rollback Procedure

If issues occur after optimization:

```bash
# Clear all caches
php artisan optimize:clear

# Revert to non-cached mode
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Check logs
tail -f storage/logs/laravel.log
```

### Notes

- **Development**: Always run `php artisan optimize:clear` after code changes
- **Production**: Only clear caches when deploying new code
- **Route caching**: Disables closure-based routes (not used in this project)
- **Config caching**: Environment variables won't be read after caching (use `config()` helper)

## Deployment Workflow

1. **Pre-deployment**
   ```bash
   git pull origin main
   composer install --no-dev --optimize-autoloader
   npm run build
   ```

2. **Migration**
   ```bash
   php artisan migrate --force
   ```

3. **Optimization**
   ```bash
   php artisan optimize
   ```

4. **Restart services**
   ```bash
   sudo systemctl restart php-fpm
   sudo systemctl restart nginx
   ```

5. **Verification**
   ```bash
   curl -I https://ilkom.unhas.ac.id
   php artisan about
   ```

## Performance Benchmarks

Expected performance after optimization:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Route resolution | ~5ms | ~0.5ms | 90% faster |
| Config loading | ~10ms | ~0.1ms | 99% faster |
| View compilation | ~20ms | ~1ms | 95% faster |
| Total request | ~100ms | ~30ms | 70% faster |

## Troubleshooting

### Cache Issues

**Problem**: Changes not reflected after deployment

**Solution**:
```bash
php artisan optimize:clear
php artisan optimize
```

### Permission Errors

**Problem**: Cache files not writable

**Solution**:
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

### Route Cache Errors

**Problem**: Route cache fails

**Solution**: Check for closure-based routes in `routes/*.php` files. Replace with controller actions.

## Additional Resources

- [Laravel Optimization Guide](https://laravel.com/docs/11.x/deployment#optimization)
- [Laravel Performance Best Practices](https://laravel.com/docs/11.x/performance)
